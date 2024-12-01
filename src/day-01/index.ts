import { readFileSync } from "fs";

const file = readFileSync("./src/day-01/input.txt", "utf-8");

const leftList = file.split("\n").map((s) => Number(s.split("   ")[0]));
const rightList = file.split("\n").map((s) => Number(s.split("   ")[1]));

function partOne(): void {
    leftList.sort((a, b) => a - b);
    rightList.sort((a, b) => a - b);

    const distances = leftList.map((l, i) => Math.abs(l - rightList[i]));

    const totalDistance = distances.reduce((a, b) => a + b, 0);

    console.log(totalDistance);
}

function partTwo(): void {
    const similarityScores = leftList.map((a) => {
        const foundMatches = rightList.filter((b) => b === a).length;

        return a * foundMatches;
    });

    const totalSimilarity = similarityScores.reduce((a, b) => a + b, 0);

    console.log(totalSimilarity);
}

partOne();
partTwo();

