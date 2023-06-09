import Character from './character.js'

import express from 'express'
const app = express()
const port = 3000

app.post('/', (req, res) => {
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

    const TURN_MAX = 1000
    const HIT_RATE_MIN = 0.95
    const TICK_RATE_MILLISECOND = 100
    let logs = []
    for (let turn = 1; turn <= TURN_MAX; turn++) {
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

        if (events.length > 0) {
            logs.push({
                'timestamp_ms': turn * TICK_RATE_MILLISECOND,
                events
            })
        }

        if (player.isDead() || enemy.isDead()) {
            break;
        }
    }

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/json')
    res.end(JSON.stringify({
        '_enemy': enemy.getStats(),
        '_player': player.getStats(),
        logs
    }))
})

app.listen(port)
