import { readFileSync } from "fs";

const file = readFileSync("./src/day-09/input.txt", "utf-8");

type RawFileCell = {
    id: string;
    length: number;
    freeSpace: number;
};

type FileStringCell = {
    id: string;
    isOccupied: boolean;
};

const files: RawFileCell[] = [];

let x = 0;

for (let i = 0; i < file.split("").length; i += 2) {
    files.push({
        id: `${x}`,
        length: Number(file.split("")[i]),
        freeSpace: Number(file.split("")[i + 1]) || 0,
    });

    x++;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function printFiles(fileString: FileStringCell[]) {
    for (const f of fileString) {
        process.stdout.write(f.id);
    }

    process.stdout.write("\n");
}

function findFirstConsecutive(
    fileString: FileStringCell[],
    length: number
): number | undefined {
    let count = 0;

    for (const [i, file] of fileString.entries()) {
        if (!file.isOccupied) {
            count++;
        } else {
            count = 0;
        }

        if (count >= length) return i - count + 1;
    }

    return;
}

function getFileString(): FileStringCell[] {
    const fileString: FileStringCell[] = [];

    for (const [i, file] of files.entries()) {
        for (let j = 0; j < file.length; j++) {
            fileString.push({ id: `${i}`, isOccupied: true });
        }

        for (let j = 0; j < file.freeSpace; j++) {
            fileString.push({ id: ".", isOccupied: false });
        }
    }

    return fileString;
}

function swapCells(
    fileString: FileStringCell[],
    freeIndex: number,
    occupiedIndex: number
) {
    const id = fileString[occupiedIndex]?.id;

    if (!id || id === ".") return;

    fileString[freeIndex] = {
        id,
        isOccupied: true,
    };

    fileString[occupiedIndex] = {
        id: ".",
        isOccupied: false,
    };
}

function getChecksum(fileString: FileStringCell[]) {
    let sum = 0;
    for (const [i, file] of fileString.entries()) {
        if (!file.isOccupied) continue;
        sum += Number(file.id) * i;
    }

    return sum;
}

function partOne(): void {
    const fileString = getFileString();

    for (let i = fileString.length - 1; i >= 0; i--) {
        const firstEmptySlot = fileString
            .map((f) => f.isOccupied)
            .indexOf(false);

        if (firstEmptySlot === -1 || firstEmptySlot >= i) break;

        swapCells(fileString, firstEmptySlot, i);
    }

    console.log(getChecksum(fileString));
}

function partTwo(): void {
    const fileString = getFileString();

    const filesMoved: string[] = [];

    for (let i = fileString.length - 1; i >= 0; i--) {
        if (filesMoved.includes(fileString[i].id)) continue;

        const file = files.find((f) => f.id === fileString[i].id);

        if (!file) continue;

        const firstEmptySlot = findFirstConsecutive(fileString, file.length);

        if (!firstEmptySlot || firstEmptySlot >= i) continue;

        for (let j = 0; j < file.length; j++) {
            swapCells(fileString, firstEmptySlot + j, i - j);

            filesMoved.push(file.id);
        }
    }

    console.log(getChecksum(fileString));
}

partOne();
partTwo();

