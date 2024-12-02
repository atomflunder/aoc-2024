import { readFileSync } from "fs";

const file = readFileSync("./src/day-02/input.txt", "utf-8");

const reports: string[] = file.split("\n");
const levels: number[][] = reports.map((r) =>
    r.split(" ").map((l) => Number(l))
);

function isValidDecreasing(levels: number[]) {
    for (let i = 0; i < levels.length - 1; i++) {
        const currentLevel = levels[i];
        const nextLevel = levels[i + 1];

        const diff = currentLevel - nextLevel;

        if (diff > 3 || diff < 1) return false;
    }

    return true;
}

function isValidIncreasing(levels: number[]) {
    for (let i = 0; i < levels.length - 1; i++) {
        const currentLevel = levels[i];
        const nextLevel = levels[i + 1];

        const diff = nextLevel - currentLevel;

        if (diff > 3 || diff < 1) return false;
    }

    return true;
}

function isValid(levels: number[]) {
    return isValidDecreasing(levels) || isValidIncreasing(levels);
}

function isValidDampened(levels: number[]): boolean {
    if (isValid(levels)) return true;

    for (let i = 0; i < levels.length; i++) {
        // Copies the array
        const newLevels = levels.slice();
        newLevels.splice(i, 1);

        if (isValid(newLevels)) return true;
    }

    return false;
}

function partOne(): void {
    console.log(levels.filter((l) => isValid(l)).length);
}

function partTwo(): void {
    console.log(levels.filter((l) => isValidDampened(l)).length);
}

partOne();
partTwo();

