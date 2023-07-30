import { createClient } from "redis"

const TICK_RATE_MILLISECOND = 3000

const redis = createClient({
    url: "redis://default:password@cache:6379"
});
await redis.connect()

let city = {
    "population": 1,
}
await redis.set("city", JSON.stringify(city))

setInterval(() => {
    main()
}, TICK_RATE_MILLISECOND)

async function main() {
    console.log(new Date() + " : " + city.population)
    city.population++
    await redis.set("city", JSON.stringify(city))
}
