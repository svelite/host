import { generateApiKey, login } from "./services/auth/index.js"
import { readFileSync } from 'fs'
import pm2 from 'pm2'

import { activateDeployment, deployProject } from "./services/project/deploy.js"
import { startProject, statrProject, stopProject } from "./services/project/run.js"
import { getProject, getProjects } from "./services/project/crud.js"

import db from './services/db/index.js'
import { uploadFile } from "./services/file.js"
import { setup } from "./services/project/setup.js"

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

const { PORT = 5173 } = process.env

// db('projects').query({})
//     .then(res => res.data.filter(x => !!x.active_deployment))
//     .then(projects => {

//         for (let project of projects) {
//             pm2.delete(`svelite-${project.id}`, () => {

//                 pm2.start({
//                     script: './index.js',
//                     cwd: `./sites/${project.id}`,
//                     name: `svelite-${project.id}`,
//                     env: {
//                         'DEPLOYMENT_ID': project.active_deployment,
//                         'PORT': project.port,
//                     }
//                 }, () => {
//                     pm2.dump()
//                 })

//             })

//         }
//     })


export default {
    db: {
        base_url: 'http://localhost:' + PORT,
        token: 'db'
    },
    routes: {
        ...dbProvider('db'),
        'api/upload': {
            async POST(req) {
                const result = await uploadFile(req)

                return {
                    body: result,
                    status: 200,
                    headers: {}
                }
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
        'api/token/new': {
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
        'api/deploy': {
            async POST(req) {
                const { name, fileId, projectId } = req.body

                // TODO: Check if name has conflict

                const deployResponse = await deployProject({ fileId, name, projectId })

                return {
                    body: deployResponse
                }
            }
        },
        'api/rollback': {
            async POST(req) {
                const { projectId, deploymentId } = req.body;

                await activateDeployment({ projectId, deploymentId })
                return {
                    body: { success: true }
                }
            }
        },
        'api/start': {
            async POST({ body }) {
                const { projectId, deploymentId = null } = body

                const runResult = startProject({ projectId, deploymentId })

                return {
                    body: runResult
                }
            }
        },
        'api/stop': {
            async POST({ body }) {
                const { projectId } = body
                const stopResult = await stopProject({ projectId })

                return { body: stopResult }
            }
        },
        'api/projects': {
            async GET() {
                const projects = await getProjects()

                return {
                    body: projects
                }
            }
        },
        'api/user': {
            async GET({ params, headers }) {
                // TODO: Get User from token (cookie)

                return {
                    body: {}
                }
            }
        },
        'api/projects/:id': {
            async GET({ params }) {
                const project = await getProject({ id: params.id })

                return {
                    body: project
                }
            }
        },
        'api/login': {
            async POST(req) {
                return {
                    body: await login(req.body),
                    status: 200,
                    headers: {}
                }
            }
        },
        'api/setup': {
            async POST(req) {
                const result = await setup(req.body)

                // return redirect('/')
                return {
                    body: { result }
                }
            }

        },
        'api/initialized': {
            async GET(req) {
                const initialized = await db('users').query({}).then(res => res.data.length > 0)

                return {

                    body: { initialized }
                }
            }
        }
    }
}
