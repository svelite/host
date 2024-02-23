export default {
    plugins: [/* List of plugins */],
    pages: [
        {
            slug: '/',
            layout: {
                name: 'AdminLayout'
            },
            modules: [
                {name: "PageHeader", props: {title: "Svelite Hosting"}},
                { name: "Home" },
                { name: "ProjectList" },
            ]
        },
        {
            slug: '/:project',
            layout: {
                name: 'AdminLayout'
            },
            modules: [
                {name: "PageHeader", props: {title: "Project Detail", backUrl: '/'}},
                {name: 'ProjectDetail', params: {id: ':project'}},
                {name: 'DeploymentList', params: {id: ':project'}}
            ]
        },
        {
            slug: '/setup',
            layout: {
                name: 'EmptyLayout'
            },
            modules: [
                {name: 'Setup'}
            ]
        },
    ],
    modules: {
        Home: import('./modules/Home.svelte'),
        Setup: import('./modules/Setup.svelte'),
        ProjectDetail: import('./modules/ProjectDetail.svelte'),
        DeploymentList: import('./modules/DeploymentList.svelte'),
        ProjectList: import('./modules/ProjectList.svelte'),
        PageHeader: import('./modules/PageHeader.svelte'),
        // module definitions
    },
    layouts: {
        AdminLayout: import('./layouts/AdminLayout.svelte'),
        EmptyLayout: import('./layouts/EmptyLayout.svelte'),
        // layout definitions
    }
}