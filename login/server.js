const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    const data = {
        'access_token': {
            // Immediately expire
            'exp': Math.floor(Date.now() / 1000),
            'user': 'marvin',
            'role': 'developer',
        }
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(data))
})

app.listen(port)
