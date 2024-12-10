import { readFileSync } from "fs";

const file = readFileSync("./src/day-10/input.txt", "utf-8");

type Coordinates = {
    x: number;
    y: number;
    height: number;
};

const grid: Coordinates[][] = [];

for (const [y, line] of file.split("\n").entries()) {
    const currentLine: Coordinates[] = [];

    for (const [x, char] of line.split("").entries()) {
        currentLine.push({ x, y, height: Number(char) });
    }

    grid.push(currentLine);
}

const gridXLength = grid[0].length;
const gridYLength = grid.length;

const trailheads: Coordinates[] = [];

for (const line of grid) {
    trailheads.push(...line.filter((c) => c.height === 0));
}

function getNextSteps(currentStep: Coordinates): Coordinates[] {
    const nextSteps: Coordinates[] = [];

    if (currentStep.x !== 0) {
        const possibleNextStep = grid[currentStep.y][currentStep.x - 1];

        if (possibleNextStep.height - currentStep.height === 1) {
            nextSteps.push(possibleNextStep);
        }
    }

    if (currentStep.x !== gridXLength - 1) {
        const possibleNextStep = grid[currentStep.y][currentStep.x + 1];

        if (possibleNextStep.height - currentStep.height === 1) {
            nextSteps.push(possibleNextStep);
        }
    }

    if (currentStep.y !== 0) {
        const possibleNextStep = grid[currentStep.y - 1][currentStep.x];

        if (possibleNextStep.height - currentStep.height === 1) {
            nextSteps.push(possibleNextStep);
        }
    }

    if (currentStep.y !== gridYLength - 1) {
        const possibleNextStep = grid[currentStep.y + 1][currentStep.x];

        if (possibleNextStep.height - currentStep.height === 1) {
            nextSteps.push(possibleNextStep);
        }
    }

    return nextSteps;
}

function traversePath(trailhead: Coordinates): Coordinates[] {
    const allCoordinatesInPath: Coordinates[] = [trailhead];

    for (let currentHeight = 0; currentHeight <= 9; currentHeight++) {
        const currentSteps = allCoordinatesInPath.filter(
            (c) => c.height === currentHeight
        );

        for (const currentStep of currentSteps) {
            const nextSteps = getNextSteps(currentStep);

            for (const step of nextSteps) {
                allCoordinatesInPath.push(step);
            }
        }
    }

    return allCoordinatesInPath.filter((c) => c.height === 9);
}

function partOne(): void {
    let sum = 0;

    for (const trailhead of trailheads) {
        const foundNines = traversePath(trailhead);
        sum += [...new Set(foundNines)].length;
    }

    console.log(sum);
}

function partTwo(): void {
    let sum = 0;

    for (const trailhead of trailheads) {
        const foundNines = traversePath(trailhead);
        sum += foundNines.length;
    }

    console.log(sum);
}

partOne();

partTwo();

