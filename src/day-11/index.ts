import { readFileSync } from "fs";

const file = readFileSync("./src/day-11/input.txt", "utf-8");

const stones = file.split(" ").map((s) => Number(s));

let stoneMap = new Map<number, number>();

for (const stone of stones) {
    stoneMap.set(stone, 1);
}

function addOrSet(map: Map<number, number>, key: number, value: number) {
    if (!map.get(key)) {
        map.set(key, value);

        return;
    }

    map.set(key, map.get(key)! + value);
}

function blink() {
    const newStoneMap = new Map<number, number>();

    for (const [stone, count] of stoneMap) {
        const length = Math.floor(Math.log10(stone) + 1);

        if (stone === 0) {
            addOrSet(newStoneMap, 1, count);
        } else if (length % 2 === 0) {
            const leftStone = Math.floor(stone / Math.pow(10, length / 2));

            const rightStone = stone % Math.pow(10, length / 2);

            addOrSet(newStoneMap, leftStone, count);

            addOrSet(newStoneMap, rightStone, count);
        } else {
            addOrSet(newStoneMap, stone * 2024, count);
        }
    }

    stoneMap = newStoneMap;
}

function getSum(stoneMap: Map<number, number>): number {
    let sum = 0;
    stoneMap.forEach((s) => {
        sum += s;
    });
    return sum;
}

function partOne(): void {
    for (let i = 0; i < 25; i++) blink();
    console.log(getSum(stoneMap));
}

function partTwo(): void {
    // 75x total, we don't reset the map from partOne
    for (let i = 0; i < 50; i++) blink();
    console.log(getSum(stoneMap));
}

partOne();
partTwo();

