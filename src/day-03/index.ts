import { readFileSync } from "fs";

const file = readFileSync("./src/day-03/input.txt", "utf-8");

function getOperation(match: RegExpExecArray) {
    const numbers = match[0].matchAll(/[0-9]+/g);

    const lhs = Number(numbers.next().value);

    const rhs = Number(numbers.next().value);

    return lhs * rhs;
}

function partOne() {
    const matches = file.matchAll(/mul\([0-9]+,[0-9]+\)/gm);

    let sum = 0;

    for (const m of matches) {
        sum += getOperation(m);
    }

    console.log(sum);
}

function partTwo() {
    const matches = file.matchAll(/mul\([0-9]+,[0-9]+\)/gm);

    const dontMatches = file.matchAll(/don't\(\)/gm);

    const doMatches = file.matchAll(/do\(\)/gm);

    let multiplicationEnabled = true;

    let nextDontMatch = dontMatches.next();

    let nextDoMatch = doMatches.next();

    let sum = 0;

    for (const m of matches) {
        if (nextDontMatch.value && m.index >= nextDontMatch.value.index) {
            multiplicationEnabled = false;

            nextDontMatch = dontMatches.next();
        }

        if (nextDoMatch.value && m.index >= nextDoMatch.value.index) {
            multiplicationEnabled = true;

            nextDoMatch = doMatches.next();
        }

        if (multiplicationEnabled) {
            sum += getOperation(m);
        }
    }

    console.log(sum);
}

partOne();

partTwo();

