import db from '../db'
import pm2 from 'pm2'
import { runScript } from '../helpers'

export async function startProject({projectId, deploymentId}) {

    const project = await db('projects').query({filters: [
        {
            field: 'id',
            operator: '=',
            value: projectId
        }
    ]}).then(res => res.data[0])

    if(!project) throw new Error('Project not found!')

    await stopProject({projectId})

    if(deploymentId) {
        project.active_deployment = deploymentId
        await db('projects').update(project.id, project)
    }


    pm2.connect(() => {
        pm2.describe('svelite-' + projectId, (err, desc) => {
            if(err || !desc.length) {
                pm2.start({
                    script: 'index.js',
                    cwd: './sites/' + projectId,
                    name: 'svelite-' + projectId,
                    env: {
                        PORT: project.port,
                        DEPLOYMENT_ID: project.active_deployment
                    }
                }, () => {
                    pm2.dump()
                })

            } else {
                pm2.restart({
                    script: 'index.js',
                    cwd: './sites/' + projectId,
                    name: 'svelite-' + projectId,
                    env: {
                        PORT: project.port,
                        DEPLOYMENT_ID: project.active_deployment
                    }
                }, () => {
                    pm2.dump()
                })
            }
        })
    })
  
    return {
        url: `https://${project.name}.cms.hadiahmadi.dev`
    }
}

export async function stopProject({projectId}) {

    const project = await db('projects').query({filters: [
        {
            field: 'id',
            operator: '=',
            value: projectId
        }
    ]}).then(res => res.data[0])

    if(!project) throw new Error('Project not found!')

    project.active_deployment = null
    await db('projects').update(project.id, project)

    runScript('./stop.sh', ['./sites/' + projectId])

    return {
        success: true
        // url: `https://${project.name}.cms.hadiahmadi.dev`
    }
}