export async function runProject({projectId, deploymentId}) {

    const project = await db('projects').query({filters: [
        {
            field: 'id',
            operator: '=',
            value: projectId
        }
    ]}).then(res => res.data[0])

    if(!project) throw new Error('Project not found!')

    if(deploymentId) {
        project.active_deployment = deploymentId
        await db('projects').update(project.id, project)
    }

    runScript('./run.sh', ['./sites/' + projectId, project.active_deployment, project.port])

    return {
        url: `https://${project.name}.cms.hadiahmadi.dev`
    }
}