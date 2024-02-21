import { createDb } from "./services/db/index.js"
import { createAdapter } from './services/db/file.js'
import { generateApiKey } from "./services/auth/index.js"
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import Busboy from "busboy"
import yauzl from 'yauzl'
import fs from 'fs'
import path from 'path'

import { getId } from "./services/db/helpers.js"
import { spawn } from "child_process"

const adapter = createAdapter('default')
const db = createDb(adapter)

function dbProvider(prefix) {
    return {
        [prefix + '/:table/query']: {
            async POST({ body, params }) {

                return {
                    body: JSON.stringify(await db(params.table).query(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/insert']: {
            async POST({ body, params }) {

                return {
                    body: JSON.stringify(await db(params.table).insert(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/update']: {
            async POST({ body, params }) {

                return {
                    body: JSON.stringify(await db(params.table).update(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/remove']: {
            async POST({ body, params }) {

                return {
                    body: JSON.stringify(await db(params.table).remove(body)),
                    status: 200,
                    headers: {}
                }
            }
        }
    }
}

function runScript(command, args) {
    return new Promise(resolve => {
        console.log('runScript', command, args)

        const child = spawn(command, args)

        child.stdout.on('data', (data) => {
            console.log(command + `: ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(command + `(err): ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve()
        });
    })
}


const { PORT = 5173 } = process.env

export default {
    db: {
        base_url: 'http://localhost:' + PORT,
        token: 'db'
    },
    routes: {
        ...dbProvider('db'),
        'upload': {
            async POST(req) {
                let body = []
                return new Promise(resolve => {
                    console.log('upload')
                    req.on('data', (chunk) => {
                        body.push(chunk)
                    })

                    req.on('end', () => {
                        const file = Buffer.concat(body)

                        const name = getId()

                        if (!existsSync('./data/files')) {
                            mkdirSync('./data/files');
                        }

                        writeFileSync(`./data/files/` + name, file)
                        resolve({
                            body: {
                                id: name
                            }
                        })
                    })
                })
            }
        },
        'file/:id': {
            async GET({ params }) {
                const file = readFileSync('./data/files/' + params.id)

                return {
                    raw: file
                }
            }
        },
        'token/new': {
            async POST(req) {
                return {
                    body: {
                        token: generateApiKey()
                    },
                    status: 200,
                    headers: {}
                }
            }
        },
        'deploy': {
            async POST(req) {
                return new Promise(async resolve => {

                    const file_id = req.body.id
                    const name = req.body.name

                    // TODO: if name has conflict, create new name
                    const deploymentId = getId()
                    let projectId = req.body.project_id


                    // first site
                    if (!existsSync('./sites/')) {
                        mkdirSync('./sites')
                    }


                    // first deployment in this site
                    if (!projectId) {

                        const projectsPath = './sites';
                        const projects = fs.readdirSync(projectsPath);

                        function getNextAvailablePort() {
                            let port = 3100;

                            while (true) {
                                if (!isPortInUse(port)) {
                                    return port;
                                }
                                port++;
                            }
                        }

                        function isPortInUse(port) {
                            // Check if the port is in use based on your project configuration

                            for (const project of projects) {
                                const configPath = path.join(projectsPath, project, 'config.json');
                                if (fs.existsSync(configPath)) {
                                    const config = JSON.parse(fs.readFileSync(configPath));
                                    if (config.port === port) {
                                        return true;
                                    }
                                }
                            }

                            return false;
                        }

                        const port = getNextAvailablePort();


                        projectId = getId()

                        mkdirSync('./sites/' + projectId)
                        cpSync('./files/site/package.json', './sites/' + projectId + '/package.json')
                        cpSync('./files/site/index.js', './sites/' + projectId + '/index.js')

                        writeFileSync('./sites/' + projectId + '/config.json', JSON.stringify({
                            name,
                            active_deployment: deploymentId,
                            port
                        }))

                        function generateNginxConfig(config) {
                            const port = config.port
                            const name = config.name

                            return `
# project_id=${projectId}
server {
    server_name ${name}.cms.hadiahmadi.dev;
    location / {
        proxy_pass http://localhost:${port};
    }
}
`    
                        }

                        const nginxConfig = readFileSync('/etc/nginx/sites-available/svelite.conf', 'utf-8')

                        writeFileSync('/etc/nginx/sites-available/svelite.conf', generateNginxConfig({port, name}) + nginxConfig)

                        await runScript('./start.sh', ['./sites/' + name, port, name])

                    }

                    const file = readFileSync('./data/files/' + file_id)
                    if (!file) throw new Error('No file');

                    const folder = './sites/' + projectId
                    mkdirSync(folder + '/' + deploymentId)

                    yauzl.open('./data/files/' + file_id, { lazyEntries: true, autoClose: true }, (err, zip) => {
                        zip.readEntry();


                        zip.on('entry', (entry) => {
                            console.log('entry: ', entry.fileName)

                            if (entry.fileName.endsWith('/') && entry.fileName !== '/') {
                                // Directory file names end with '/'
                                // fs.mkdirSync(path.join(folder, entry.fileName), { recursive: true });
                                zip.readEntry();
                            } else {
                                zip.openReadStream(entry, (err, readStream) => {
                                    console.log('err: ', err)
                                    if (err) {
                                        reject(err);
                                        return;
                                    }

                                    // Ensure parent directory exists
                                    fs.mkdirSync(path.dirname(path.join(folder, entry.fileName.replace('build/', deploymentId + '/'))), { recursive: true });

                                    const filename = entry.fileName.replace('build/', deploymentId + '/')
                                    console.log('name: ', filename)
                                    // Extract file
                                    readStream.pipe(fs.createWriteStream(path.join(folder, entry.fileName.replace('build/', deploymentId + '/'))));





                                    readStream.on('end', () => {

                                        console.log('zip.readEntry end')
                                        zip.readEntry();
                                    });
                                });
                            }
                        })

                        zip.on('close', () => {

                            // rmSync(path.join(folder, deploymentId, 'index.js'))
                            // rmSync(path.join(folder, deploymentId, 'package.json'))
                            // files extracted.
                            // runScript('./run.sh', [folder, deploymentId]);

                            rmSync('./data/files/' + file_id)
                            resolve({
                                body: {
                                    id: deploymentId,
                                    name
                                },
                                status: 200,
                                headers: {}
                            })
                        })
                    })
                })
            }
        },
        run: {
            async POST({ body }) {
                const { project_id, deploymentId = null } = body

                const config = JSON.parse(readFileSync('./sites/' + project_id + '/config.json', 'utf-8'))


                if(deploymentId) {
                    config.active_deployment = deploymentId

                    writeFileSync('./sites/' + project_id + '/config.json', JSON.stringify(config))
                }

                runScript('./run.sh', ['./sites/' + project_id])

                return {
                    body: {
                        url: `https://${config.name}.cms.hadiahmadi.dev`
                    }
                }
            }
        },
        'projects': {
            async GET() {
                const projects = readdirSync('./sites')      

                return {
                    body: projects.map(x => ({
                        id: x, 
                        ...JSON.parse(readFileSync('./sites/' + x + '/config.json', 'utf-8'))
                    }))
                }
            }
        },
        'projects/:id': {
            async GET({params}) {
                const id = params.id

                const config = JSON.parse(readFileSync('./sites/' + id + '/config.json', 'utf-8'))

                const deployments = readdirSync('./sites/' + id).filter(x => {
                    return !x.includes('config.json') && !x.includes('package.json') && !x.includes('index.js')
                })

                return {
                    body: {id, ...config, deployments}
                }
            }
        },
        test: {
            async GET(req) {
                return {
                    body: { message: "Hello World", data: await req.db('expenses').query({}) },
                    status: 200,
                    headers: {}
                }
            }
        },
        createSite(req) {

        }
        /* ... */
    }
}