import { createDb } from "./services/db/index.js"
import {createAdapter} from './services/db/file.js'

const adapter = createAdapter('default')
const db = createDb(adapter)

function dbProvider(prefix) {
    return {
        [prefix + '/:table/query']: {
            async POST({body, params}) {

                return {
                    body: JSON.stringify(await db(params.table).query(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/insert']: {
            async POST({body, params}) {

                return {
                    body: JSON.stringify(await db(params.table).insert(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/update']: {
            async POST({body, params}) {

                return {
                    body: JSON.stringify(await db(params.table).update(body)),
                    status: 200,
                    headers: {}
                }
            }
        },
        [prefix + '/:table/remove']: {
            async POST({body, params}) {

                return {
                    body: JSON.stringify(await db(params.table).remove(body)),
                    status: 200,
                    headers: {}
                }
            }
        }
    }
}

const {PORT = 5173} = process.env

export default {
    db: {
        // base_url: 'https://db.hadiahmadi.dev',
        base_url: 'http://localhost:' + PORT,
        token: 'db'
        /* token: '<get a token from https://db.hadiahmadi.dev/new>' */
    },
    routes: {
        ...dbProvider('db'),
        test: {
            async GET(req) {
                return {
                    body: {message: "Hello World", data: await req.db('expenses').query({})},
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