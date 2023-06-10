const express = require('express')
const app = express()
const port = 3000

app.post('/', (req, res) => {
    const data = {
        'hello': 'world'
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(data))
})

app.listen(port)
