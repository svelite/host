import db from '../db/index.js'

export async function setup({username, password}) {
    if (!existsSync('./sites/')) {
        mkdirSync('./sites')
    }

    if (!existsSync('./data/files')) {
        mkdirSync('./data/files', {recursive: true});
    }

    await db('users').insert({username, password: password + '-hashed'})

    return true;
}