export default {
    plugins: [/* List of plugins */],
    pages: [
        {
            slug: '/',
            layout: {
                name: 'AdminLayout'
            },
            modules: [
                { name: "Home" }
            ]
        }
    ],
    modules: {
        Home: import('./modules/Home.svelte')
        // module definitions
    },
    layouts: {
        AdminLayout: import('./layouts/AdminLayout.svelte')
        // layout definitions
    }
}