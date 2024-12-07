import { readFileSync } from "fs";

const file = readFileSync("./src/day-07/input.txt", "utf-8");

type Equation = {
    solution: number;
    remainingNumbers: number[];
};

const equations: Equation[] = [];

for (const line of file.split("\n")) {
    const [solution, nums] = line.split(": ");

    equations.push({
        solution: Number(solution),
        remainingNumbers: nums.split(" ").map((n) => Number(n)),
    });
}

function getSolutions(equation: Equation) {
    return [
        equation.remainingNumbers[0] + equation.remainingNumbers[1],
        equation.remainingNumbers[0] * equation.remainingNumbers[1],
        Number(
            "" + equation.remainingNumbers[0] + equation.remainingNumbers[1]
        ),
    ];
}

function isSolvable(equation: Equation, withConcatenation: boolean = false) {
    const [s1, s2, s3] = getSolutions(equation);

    if (equation.remainingNumbers.length === 2) {
        return (
            s1 === equation.solution ||
            s2 === equation.solution ||
            (withConcatenation && s3 === equation.solution)
        );
    }

    const newEquationAdd: Equation = {
        solution: equation.solution,
        remainingNumbers: [s1, ...equation.remainingNumbers.slice(2)],
    };
    if (isSolvable(newEquationAdd, withConcatenation)) {
        return true;
    }

    const newEquationMul: Equation = {
        solution: equation.solution,
        remainingNumbers: [s2, ...equation.remainingNumbers.slice(2)],
    };
    if (isSolvable(newEquationMul, withConcatenation)) {
        return true;
    }

    if (withConcatenation) {
        const newEquationCon: Equation = {
            solution: equation.solution,
            remainingNumbers: [s3, ...equation.remainingNumbers.slice(2)],
        };
        if (isSolvable(newEquationCon, withConcatenation)) {
            return true;
        }
    }

    return false;
}

function partOne(): void {
    let validEquationSum = 0;

    for (const equation of equations) {
        if (isSolvable(equation)) {
            validEquationSum += equation.solution;
        }
    }

    console.log(validEquationSum);
}

function partTwo(): void {
    let validEquationSum = 0;

    for (const equation of equations) {
        if (isSolvable(equation, true)) {
            validEquationSum += equation.solution;
        }
    }

    console.log(validEquationSum);
}

partOne();
partTwo();

