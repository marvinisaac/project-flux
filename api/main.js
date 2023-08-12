import Character from './character.js'
import express from 'express'
import crypto from 'crypto'
import { createClient } from "redis"
import points from './points.js'
import cors from 'cors'

const app = express()
app.use(cors())
const port = 3000
const redis = createClient({
    url: "redis://default:password@cache:6379"
});
await redis.connect()

app.get('/points', (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(points()))
})

app.get('/health', (req, res) => {
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify({
        'health': 'okay'
    }))
})

app.post('/login', (req, res) => {
    const data = {
        'access_token': {
            'user': 'marvin',
            'role': 'developer',
        }
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify(data))
})

app.post('/combat', (req, res) => {
    const player = new Character({
        'agi': Math.round(Math.random() * 100),
        'con': Math.round(Math.random() * 100),
        'dex': Math.round(Math.random() * 100),
        'str': Math.round(Math.random() * 100)
    })

    const enemy = new Character({
        'agi': Math.round(Math.random() * 100),
        'con': Math.round(Math.random() * 100),
        'dex': Math.round(Math.random() * 100),
        'str': Math.round(Math.random() * 100)
    })

    const COMBAT_MAX_SECOND = 60
    const HIT_RATE_MIN = 0.95
    const TICK_RATE_MILLISECOND = 100
    const TURN_MAX = (COMBAT_MAX_SECOND * 1000) / TICK_RATE_MILLISECOND
    let logs = []
    let turn = 1
    while (!player.isDead() && !enemy.isDead() && turn < TURN_MAX) {
        let baseHp = 0
        let currentHp = 0
        let damage = 0
        let events = []
        let log = ''

        if (player.isTurn()) {
            log = ''
            if (player.hitRate >= enemy.evasion || Math.random() >= HIT_RATE_MIN) {
                damage = player.damage - enemy.defense
                damage = damage > 0 ? damage : 1
                enemy.damageReceived = damage
                log += `Player attacks doing ${damage} damage. `

                baseHp = enemy.baseHp
                currentHp = enemy.currentHp() > 0 ? enemy.currentHp() : 0
                log += `Enemy HP: ${currentHp}/${baseHp}. `
            } else {
                log += 'Player attacks but misses. '
            }
            events.push(log.trim())
        }

        if (enemy.isTurn() && !enemy.isDead()) {
            log = ''
            if (enemy.hitRate >= player.evasion || Math.random() >= HIT_RATE_MIN) {
                damage = enemy.damage - player.defense
                damage = damage > 0 ? damage : 1
                player.damageReceived = damage
                log += `Enemy attacks doing ${damage} damage. `

                baseHp = player.baseHp
                currentHp = player.currentHp() > 0 ? player.currentHp() : 0
                log += `Player HP: ${currentHp}/${baseHp}. `
            } else {
                log += 'Enemy attacks but misses. '
            }
            events.push(log.trim())
        }

        // TODO: Add timestamp to time of combat resolution to make it seem like it happens in real-time
        if (events.length > 0) {
            logs.push({
                events,
                'timestamp_ms': turn * TICK_RATE_MILLISECOND
            })
        }

        turn++;
    }

    if (turn === TURN_MAX) {
        logs.push({
            'events': [ 'Player and enemy withdraw' ],
            'timestamp_ms': turn * TICK_RATE_MILLISECOND
        })
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify({
        '_enemy': enemy.getStats(),
        '_player': player.getStats(),
        logs
    }))
})

app.get('/world', async (req, res) => {
    let cacheKey = req.query.object ?? "city"
    let response = await redis.get(cacheKey)
    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify({
        cacheKey,
        response: JSON.parse(response)
    }))
})

app.listen(port)

// let counter = 0
// setInterval(() => {
// while (true) {
//     const MAX = Math.pow(2, 48) - 1
//     const RANDOM = crypto.randomInt(0, MAX)
//     if (RANDOM.toString().includes('00000000')) {
//         // console.log(new Date() + ' : ' + RANDOM)
//         console.log(counter + ' : ' + RANDOM)
//         counter = 0
//     } else {
//         counter++
//     }
// }
// }, 1000 / 64)
// }, (1000 / 64))
