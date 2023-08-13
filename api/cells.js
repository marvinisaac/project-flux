import fs from 'fs'

const getCells = () => {
    let points = [];
    try {
        let worldData = fs.readFileSync('mond-full.json');
        let cells = JSON.parse(worldData).cells.cells;
        let biomes = JSON.parse(worldData).biomes;
        cells.forEach(cell => {
            points.push({
                habitability: biomes.habitability[cell.biome],
                hasRiver: cell.r !== 0,
                height: cell.h,
                point: cell.p,
                population: cell.pop,
                score: cell.s,
            });
        });
    } catch (error) {
        console.error(error)
    }
    return points;
}

export {
    getCells
};
