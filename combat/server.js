import Character from './character.js'

const player = new Character({
    'agi': 45,
    'con': 50,
    'dex': 50,
    'str': 50
})

const enemy = new Character({
    'agi': 25,
    'con': 25,
    'dex': 25,
    'str': 25
})

import express from 'express'
const app = express()
const port = 3000

app.post('/', (req, res) => {
    
    const turnLimit = 10
    let logs = []
    for (let turn = 1; turn <= turnLimit;) {
        let events = []
        if (player.isTurn()) {

            events.push('Player attacks')
        }
        if (enemy.isTurn()) {
            events.push('Enemy attacks')
        }

        if (events.length > 0) {
            logs.push({
                events
            })
            turn++
        }
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify({logs}))
})

app.listen(port)
