import {readFileSync} from 'fs'
import express from 'express'
import sirv from 'sirv'

let id = process.env.DEPLOYMENT_ID

let render;
const app = express()

app.use(sirv(`./${id}/client`))
app.use(express.json())

app.use('/', async (req, res) => {

    if(!render) {
        await import(`./${id}/server/server.mjs`).then(module => {
            render = module.render
        })
    }
    const template = readFileSync(`./${id}/client/.svelite/index.html`, 'utf-8')
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
