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
        "growth_percent": 0,
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
    city.farming_multiplier = crypto.randomInt(10, 20)
    city.resources.farmland = crypto.randomInt(1, 50)
    cities.push(city)
}
// let cities = [
//     {
//         "name": "A",
//         "growth_percent": 0,
//         "farming_multiplier": 10,
//         "population": {
//             "total": 10,
//             "farmer": 1,
//         },
//         "resources": {
//             "farmland": 8,
//             "food": 10,
//         }
//     }, {
//         "name": "B",
//         "growth_percent": 0,
//         "farming_multiplier": 12,
//         "population": {
//             "total": 10,
//             "farmer": 1,
//         },
//         "resources": {
//             "farmland": 24,
//             "food": 10,
//         }
//     }, {
//         "name": "C",
//         "growth_percent": 0,
//         "farming_multiplier": 30,
//         "population": {
//             "total": 50,
//             "farmer": 1,
//         },
//         "resources": {
//             "farmland": 16,
//             "food": 150,
//         }
//     }
// ]
// await redis.set("city", JSON.stringify(city))

// console.table(city)
fs.writeFileSync('data/init.json', JSON.stringify(cities, null, 4))
let line = ","
cities.forEach(city => {
    line += city.name + ","
})
fs.writeFileSync('data/history.csv', line + "\n", {flag: "w+"})

while (counter < (3600 * 24 * 30)) {
    main()
}
exit(0)
// setInterval(() => {
//     main()
// }, TICK_RATE_MILLISECOND)

async function main() {
    cities.forEach(city => {
        city.resources.food += harvest(city)
    
        // General population eats food
        let consumption = city.population.total
        city.resources.food -= consumption
    
        // For every tick where the were enough food, city growth increases
        // Otherwise, it decreases
        if (city.resources.food >= 0) {
            city.growth_percent += 10
        } else {
            city.resources.food = 0
            city.growth_percent -= 10
        }
    
        // If city growth is at 100, increase city population
        // If it hits -100, decrease city population by a random percentage between 20% - 5%
        if (city.growth_percent >= 100) {
            city.population.total += crypto.randomInt(1, 4)
            // city.population.total += Math.ceil(city.resources.food / crypto.randomInt(33, 50))
            city.growth_percent = 0
        }
        if (city.growth_percent <= -100) {
            city.population.total -= Math.ceil(city.population.total / crypto.randomInt(20, 50))
            city.growth_percent = 0
        }
    
        if (city.resources.food > (city.population.total * 3)) {
            city.resources.food -= Math.floor(city.resources.food / 3)
        }
    
        // When population reaches 0, exit
        if (city.population.total <= 0) {
            exit(0)
        }
    
        if (city.resources.farmland * 8 > city.population.farmer) {
            city.population.farmer = Math.floor(city.population.total / 10)
        }
    
        // console.log(counter + " : " + new Date())
        // console.table(city)
        // await redis.set("city", JSON.stringify(city))
    });
    counter += 1
    if (counter % 3600 === 0) {
        console.log((counter / 3600) + " hours")
        let line = "Hour " + (counter / 3600) + ","
        cities.forEach(city => {
            console.log(city.name + " : " + city.population.total)
            line += city.population.total + ","

            // 3% chance of happening
            // if (3 < roll(100)) {
            //     city.resources.farmland += 1
            // } else if (3 < roll(100)) {
            //     city.resources.farmland -= 1
            // }

            // if (5 < roll(100)) {
            //     city.farming_multiplier += 1
            // } else if (5 < roll(100)) {
            //     city.farming_multiplier -= 1
            // }
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
    if (city.population.farmer * 8 > city.resources.farmland) {
        harvestLimitingFactor = city.resources.farmland * 8
    }
    harvest = harvestLimitingFactor * crypto.randomInt(harvestMultiplierMin, harvestMultiplierMax)

    return harvest
}

function roll(limit) {
    return (crypto.randomInt(0, limit)) + 1
}
