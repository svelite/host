export const indexJS = `import {readFileSync} from 'fs'
import express from 'express'
import sirv from 'sirv'

let id = process.env.DEPLOYMENT_ID

const serverJS = './' + id + '/server/server.js'
const clientFolder = './' + id + '/client'
const indexHTML = './' + id + '/client/.svelite/index.html'

let render;
const app = express()

app.use(sirv(clientFolder))
app.use(express.json())

app.use('/', async (req, res) => {

    if(!render) {
        await import(serverJS).then(module => {
            render = module.render
        })
    }
    const template = readFileSync(indexHTML, 'utf-8')
    const url = new URL(req.protocol + '://' + req.headers.host + req.url)
    const result = await render({request: req, url, method: req.method, body: req.body, template})

	if(result?.raw) {
		res.end(result.raw)
	}

    const response = typeof result?.body == 'object' ? JSON.stringify(result.body) : result?.body ?? ""
    
    res.end(response)
})

const {PORT = 3000} = process.env
app.listen(PORT, () => console.log('server started at localhost:' + PORT))
`

export const packageJSON = `{
    "type": "module",
    "dependencies": {
        "express": "^4.18.2",
        "sirv": "^2.0.4"
    }
}`