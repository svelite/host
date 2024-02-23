import {writeFileSync} from 'fs'
import { getId } from "./helpers"

export function uploadFile(req) {
    let body = []
    return new Promise(resolve => {
        req.on('data', (chunk) => {
            body.push(chunk)
        })

        req.on('end', () => {
            const file = Buffer.concat(body)

            const id = getId()

            writeFileSync(`./data/files/` + id, file)
            
            resolve({
                id
            })
        })
    })
}