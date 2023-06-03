const os = require('os')
const http = require('http')

const hostname = os.hostname()
const port = 3000

const server = http.createServer((req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end('{"hello":"world"}')
})

server.listen(port, hostname)
