import { readFileSync } from "fs";

type Letter = {
    x: number;
    y: number;
    value: string;
};

type Direction = [number, number];

const file = readFileSync("./src/day-04/input.txt", "utf-8");

const grid: Letter[][] = file.split("\n").map((l, y) =>
    l.split("").map((t, x) => {
        return {
            x,
            y,
            value: t,
        };
    })
);

const gridXLength = grid[0].length;
const gridYLength = grid.length;

const verticalHorizontalDirections: Direction[] = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
];
const diagonalDirections: Direction[] = [
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
];
const allDirections: Direction[] = [
    ...verticalHorizontalDirections,
    ...diagonalDirections,
];

function getWords(startingLetter: Letter): number {
    let matches = 0;

    const word = ["M", "A", "S"];

    outer: for (const direction of allDirections) {
        for (const [index, letter] of word.entries()) {
            const nextCoordinates = [
                startingLetter.x + direction[0] * (index + 1),
                startingLetter.y + direction[1] * (index + 1),
            ];

            if (
                nextCoordinates[1] >= gridYLength ||
                nextCoordinates[1] < 0 ||
                nextCoordinates[0] >= gridXLength ||
                nextCoordinates[0] < 0
            )
                continue outer;

            const nextLetter = grid[nextCoordinates[1]][nextCoordinates[0]];

            if (nextLetter.value !== letter) continue outer;

            if (letter === "S") matches++;
        }
    }

    return matches;
}

function getCross(startingLetter: Letter): number {
    let matches = 0;

    if (
        startingLetter.y + 2 < gridYLength &&
        startingLetter.x + 2 < gridXLength &&
        grid[startingLetter.y + 1][startingLetter.x + 1].value === "A"
    ) {
        const upperRight = grid[startingLetter.y][startingLetter.x + 2];
        const lowerLeft = grid[startingLetter.y + 2][startingLetter.x];
        const lowerRight = grid[startingLetter.y + 2][startingLetter.x + 2];

        // M̲.M
        // .A.
        // S.S
        if (
            upperRight.value === "M" &&
            lowerLeft.value === "S" &&
            lowerRight.value === "S"
        )
            matches++;

        // M̲.S
        // .A.
        // M.S
        if (
            upperRight.value === "S" &&
            lowerLeft.value === "M" &&
            lowerRight.value === "S"
        )
            matches++;
    }

    if (
        startingLetter.y - 2 >= 0 &&
        startingLetter.x - 2 >= 0 &&
        grid[startingLetter.y - 1][startingLetter.x - 1].value === "A"
    ) {
        const upperLeft = grid[startingLetter.y - 2][startingLetter.x - 2];
        const upperRight = grid[startingLetter.y - 2][startingLetter.x];
        const lowerLeft = grid[startingLetter.y][startingLetter.x - 2];

        // S.S
        // .A.
        // M.M̲
        if (
            upperRight.value === "S" &&
            lowerLeft.value === "M" &&
            upperLeft.value === "S"
        )
            matches++;

        // S.M
        // .A.
        // S.M̲
        if (
            upperRight.value === "M" &&
            lowerLeft.value === "S" &&
            upperLeft.value === "S"
        )
            matches++;
    }

    return matches;
}

function partOne() {
    const startingXs = [];

    for (const line of grid) {
        startingXs.push(...line.filter((l) => l.value === "X"));
    }

    let sum = 0;

    for (const x of startingXs) {
        sum += getWords(x);
    }

    console.log(sum);
}

function partTwo() {
    const startingMs = [];

    for (const line of grid) {
        startingMs.push(...line.filter((l) => l.value === "M"));
    }

    let sum = 0;

    for (const m of startingMs) {
        sum += getCross(m);
    }

    console.log(sum);
}

partOne();

partTwo();

