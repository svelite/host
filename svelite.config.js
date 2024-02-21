export default {
    plugins: [/* List of plugins */],
    pages: [
        {
            slug: '/',
            layout: {
                name: 'AdminLayout'
            },
            modules: [
                { name: "Home" },
                { name: "ProjectList" },
            ]
        },
        {
            slug: '/:project',
            modules: [
                {name: 'ProjectDetail', params: {id: ':project'}},
                {name: 'DeploymentList', params: {id: ':project'}}
            ]
        }
    ],
    modules: {
        Home: import('./modules/Home.svelte'),
        ProjectDetail: import('./modules/ProjectDetail.svelte'),
        DeploymentList: import('./modules/DeploymentList.svelte'),
        ProjectList: import('./modules/ProjectList.svelte'),
        // module definitions
    },
    layouts: {
        AdminLayout: import('./layouts/AdminLayout.svelte')
        // layout definitions
    }
}