export default {
    db: {
        base_url: 'https://db.hadiahmadi.dev',
        /* token: '<get a token from https://db.hadiahmadi.dev/new>' */
    },
    routes: {
        test: {
            async GET() {
                return {
                    body: {message: "Hello World"},
                    status: 200,
                    headers: {}
                }
            }
        }
        /* ... */
    }
}