import { readFileSync } from "fs";

const file = readFileSync("./src/day-08/input.txt", "utf-8");

type Coordinates = {
    x: number;
    y: number;
};

type Antenna = Coordinates & {
    name: string;
};

const antennas: Antenna[] = [];

const gridXLength = file.split("\n").length;
const gridYLength = file.split("\n")[0].split("").length;

for (const [y, line] of file.split("\n").entries()) {
    for (const [x, name] of line.split("").entries()) {
        if (name !== "." && name !== "#") {
            antennas.push({
                x,
                y,
                name,
            });
        }
    }
}

function isWithinGrid(c: Coordinates) {
    return c.x < gridXLength && c.y < gridYLength && c.x >= 0 && c.y >= 0;
}

function getAntennaAntinode(a1: Antenna, a2: Antenna): Coordinates {
    const distance: [number, number] = [a2.y - a1.y, a2.x - a1.x];

    return {
        x: a2.x + distance[1],
        y: a2.y + distance[0],
    };
}

function getAntennaAntinodes(a1: Antenna, a2: Antenna): Coordinates[] {
    const antinodes: Coordinates[] = [];

    let currentAntinode = { x: a2.x, y: a2.y };

    while (isWithinGrid(currentAntinode)) {
        const nextAntinode = getAntennaAntinode(a1, {
            x: currentAntinode.x,
            y: currentAntinode.y,
            name: a1.name,
        });

        a1 = {
            x: currentAntinode.x,
            y: currentAntinode.y,
            name: a1.name,
        };
        currentAntinode = nextAntinode;

        antinodes.push(nextAntinode);
    }

    return antinodes;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _printGrid(antennas: Antenna[], antinodes: Coordinates[]) {
    for (let y = 0; y < gridYLength; y++) {
        for (let x = 0; x < gridXLength; x++) {
            let str;

            const antenna = antennas.filter((a) => a.x === x && a.y === y)?.[0];
            const antinode = antinodes.filter(
                (a) => a.x === x && a.y === y
            )?.[0];

            if (antinode) {
                str = "#";
            } else if (antenna) {
                str = antenna.name;
            } else {
                str = ".";
            }

            process.stdout.write(str);
        }

        process.stdout.write("\n");
    }

    process.stdout.write("\n");
}

function getAntinodes(
    antinodeFunc: (a1: Antenna, a2: Antenna) => Coordinates | Coordinates[]
) {
    const antennasSearched: string[] = [];
    const foundAntinodes: Coordinates[] = [];

    for (const antenna of antennas) {
        if (antennasSearched.includes(antenna.name)) continue;

        const sameAntennas = antennas.filter((a) => a.name === antenna.name);

        for (const oppositeAntenna of sameAntennas) {
            if (
                oppositeAntenna.x === antenna.x &&
                oppositeAntenna.y === antenna.y
            )
                continue;

            const antinode = antinodeFunc(antenna, oppositeAntenna);

            if (Array.isArray(antinode)) {
                for (const an of antinode) {
                    if (
                        isWithinGrid(an) &&
                        foundAntinodes.filter(
                            (a) => a.x === an.x && a.y === an.y
                        ).length === 0
                    ) {
                        foundAntinodes.push(an);
                    }
                }
            } else {
                if (
                    isWithinGrid(antinode) &&
                    foundAntinodes.filter(
                        (a) => a.x === antinode.x && a.y === antinode.y
                    ).length === 0
                ) {
                    foundAntinodes.push(antinode);
                }
            }
        }
    }

    return foundAntinodes;
}

function partOne(): void {
    const foundAntinodes = getAntinodes(getAntennaAntinode);

    // _printGrid(antennas, foundAntinodes);
    console.log(foundAntinodes.length);
}

function partTwo(): void {
    const foundAntinodes = getAntinodes(getAntennaAntinodes);

    for (const antenna of antennas) {
        if (
            foundAntinodes.filter((a) => a.x === antenna.x && a.y === antenna.y)
                .length === 0 &&
            antennas.filter((a) => a.name).length > 0
        ) {
            foundAntinodes.push({ x: antenna.x, y: antenna.y });
        }
    }

    // _printGrid(antennas, foundAntinodes);
    console.log(foundAntinodes.length);
}

partOne();
partTwo();

