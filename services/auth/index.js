import { getId } from "../helpers.js";
import db from '../db/index.js'

export function generateApiKey() {
    return `sv-${getId()}-${getId()}-${getId()}`
}

export async function login({username, password}) {

    const users = await db('users').query({})

    for(let user of users.data) {
        if(user.username === username) {
            if(user.password === password + '-hashed') {
                // 
                return {
                    token: user.id,
                    user
                }
            }
        }
    }
    return {
        message: "Account is invalid"
    }
}

export async function getUser({}) {
    return {
        user
    }
}