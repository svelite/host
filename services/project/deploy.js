import { getId } from "../helpers.js";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'fs'
import yauzl from 'yauzl'
import fs from 'fs'
import path from 'path'
import db from '../db/index.js'
import { runScript } from "../helpers.js";


function generateNginxConfig(config) {
    const port = config.port
    const name = config.name

    return `
server {
    server_name ${name}.cms.hadiahmadi.dev;
    location / {
        proxy_pass http://localhost:${port};
    }
}
`
}


async function createProject({ name, deploymentId }) {
    // const projectId = getId()
    const projects = await db('projects').query({});

    const createProjectRequest = {
        name,
        port: getNextAvailablePort()
    }

    const project = await db('projects').insert(createProjectRequest)

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
        for (let project of projects.data) {
            if (port === project.port) {
                return true;
            }
        }

        return false;
    }


    // copy files and initialize project
    mkdirSync('./sites/' + project.id)
    cpSync('./files/site/package.json', './sites/' + project.id + '/package.json')
    cpSync('./files/site/index.js', './sites/' + project.id + '/index.js')

    const projectNginxConfigPath = `/etc/nginx/sites-available/svelite/${project.id}.conf`
    writeFileSync(projectNginxConfigPath, generateNginxConfig(project))

    await runScript('./start.sh', ['./sites/' + project.id, project.port, name])
    return project.id
}

export async function activateDeployment({projectId, deploymentId}) {
    await db('projects').update(projectId, {active_deployment: deploymentId})

}

async function createDeployment({projectId, fileId}) {
    const filePath = './data/files/' + fileId
    if (!existsSync(filePath)) {
        throw new Error('No file');
    } 

    const deployment = await db('deployments').insert({
        project_id: projectId
    })

    const folder = path.join('./sites/', projectId, deployment.id)

    await extractProject(filePath, folder)
    await activateDeployment({projectId, deploymentId: deployment.id})

    rmSync(filePath)

    return deployment
}

export async function deployProject({ fileId, name, projectId }) {
    // first deployment in this site
    if (!projectId) {
        projectId = await createProject({ name })
    }

    const deployment = await createDeployment({projectId, fileId})

    
    return {
        id: deployment.id,
        name
    }
}

async function extractProject(zipFilePath, folder) {
    return new Promise((resolve) => {

        yauzl.open(zipFilePath, { lazyEntries: true, autoClose: true }, (err, zip) => {
            zip.readEntry();


            zip.on('entry', (entry) => {

                if (entry.fileName.endsWith('/') && entry.fileName !== '/') {
                    zip.readEntry();
                } else {
                    zip.openReadStream(entry, (err, readStream) => {
                        if (err) {
                            reject(err);
                            return;
                        }

                        // Ensure parent directory exists
                        fs.mkdirSync(path.dirname(path.join(folder, entry.fileName.replace('build/', ''))), { recursive: true });

                        // Extract file
                        readStream.pipe(fs.createWriteStream(path.join(folder, entry.fileName.replace('build/', ''))));

                        readStream.on('end', () => {
                            zip.readEntry();
                        });
                    });
                }
            })

            zip.on('close', () => {

                if (existsSync(path.join(folder, 'index.js')))
                    rmSync(path.join(folder, 'index.js'))

                if (existsSync(path.join(folder, 'package.json')))
                    rmSync(path.join(folder, 'package.json'))

                resolve()
            })
        })
    })

}
