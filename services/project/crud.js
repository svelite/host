import db from '../db/index.js'

export async function getProject({id}) {
    const project = await db('projects').query({
        filters: [
            {
                field: 'id',
                operator: '=',
                value: id
            }
        ]
    }).then(res => res.data[0])

    const deployments = await db('deployments').query({
        filters: [
            {
                field: 'project_id',
                operator: '=',
                value: project.id
            }
        ]
    })

    project.deployments = deployments.data


    return project
}

export async function getProjects() {
    const projects = await db('projects').query({})

    console.log(projects)
    return projects.data
}