import { createClient } from "redis"
import crypto from 'crypto'
import { exit } from "process"
import fs from 'fs'

// const TICK_RATE_MILLISECOND = 1

const redis = createClient({
    url: "redis://default:password@cache:6379"
});
await redis.connect()

let counter = 0
let cities = []
for (let i = 1; i <= 10; i++) {
    let city = {
        "name": "",
        "growth_rate": 0,
        "farming_multiplier": 0,
        "population": {
            "total": 10,
            "farmer": 1,
        },
        "resources": {
            "farmland": 0,
            "food": 100,
        }
    }
    city.name = "City " + i
    city.farming_multiplier = crypto.randomInt(1, 50)
    city.resources.farmland = crypto.randomInt(1, 100) * i
    city.growth_rate = (crypto.randomInt(1, 30) / 1000)
    crypto.random
    cities.push(city)
}
// await redis.set("city", JSON.stringify(city))

// console.table(city)
fs.writeFileSync('data/init.json', JSON.stringify(cities, null, 4))
let line = ","
cities.forEach(city => {
    line += city.name + ","
})
fs.writeFileSync('data/history.csv', line + "\n", {flag: "w+"})

// Simulate x days at 1 tick per 1 second
while (counter < (3600 * 24 * 90)) {
    main()
}
exit(0)
// setInterval(() => {
//     main()
// }, TICK_RATE_MILLISECOND)

async function main() {
    // cities.forEach(city => {
    //     city.resources.food += harvest(city)    
    //     city.resources.food -= city.population.total
    // });

    counter += 1
    if (counter % 3600 === 0) {
        let line = (counter / 3600) + ","
        cities.forEach(city => {
            // 1% chance of happening
            if (5 > roll(100)) {
                city.resources.farmland += crypto.randomInt(0, 10)
            }
            if (1 > roll(100)) {
                city.farming_multiplier += crypto.randomInt(0, 10)
            }

            // Exponential vs logistic growth: https://www.khanacademy.org/science/ap-biology/ecology-ap/population-ecology-ap/a/exponential-logistic-growth
            let carryingCapacity = city.resources.farmland * city.farming_multiplier
            if (carryingCapacity <= 0) {
                carryingCapacity = 1
            }

            let populationChange = Math.ceil(
                city.growth_rate * city.population.total * ((carryingCapacity - city.population.total) / carryingCapacity)
                // city.growth_rate * city.population.total
            )
            if (populationChange < (0 - city.population.total)) {
                populationChange = (0 - city.population.total)
            }
            city.population.total += populationChange
            city.population.farmer = Math.floor(city.population.total / 10)

            line += city.population.total + ","
        })
        fs.writeFileSync('data/history.csv', line + "\n", {flag: "a+"})
    }
}

function harvest(city) {
    // Farmers harvest food
    // 1. One farmer has a range of food production. It depends on weather, skill, technology, etc
    // 2. How to simulate diminishing returns?
    let harvest = 0
    let harvestMultiplierMin = city.farming_multiplier
    let harvestMultiplierMax = Math.ceil(city.farming_multiplier * 2)
    let harvestLimitingFactor = city.population.farmer
    if (city.population.farmer > city.resources.farmland) {
        harvestLimitingFactor = city.resources.farmland
    }
    harvest = harvestLimitingFactor * crypto.randomInt(harvestMultiplierMin, harvestMultiplierMax)

    return harvest
}

function roll(limit) {
    return (crypto.randomInt(0, limit)) + 1
}
