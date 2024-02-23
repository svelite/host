import {customAlphabet} from 'nanoid';
import {spawn} from 'child_process'

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const getId = customAlphabet(alphabet, 8);


export function runScript(command, args) {
    return new Promise(resolve => {
        console.log('runScript:', command, args)

        const child = spawn(command, args)

        child.stdout.on('data', (data) => {
            console.log(`>>> ${data}`);
        });

        child.stderr.on('data', (data) => {
            console.error(command + `(err): ${data}`);
        });

        child.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            resolve()
        });
    })
}

