import { readFileSync } from "fs";

const file = readFileSync("./src/day-06/input.txt", "utf-8");

type Coordinates = {
    x: number;
    y: number;
    isObstacle: boolean;
    wasVisited: boolean;
};

enum Direction {
    up = "^",
    left = "<",
    right = ">",
    down = "v",
}

type Position = {
    x: number;
    y: number;
    direction: Direction;
};

class Guard {
    position: Position;

    constructor(x: number, y: number) {
        this.position = {
            x,
            y,
            direction: Direction.up,
        };
    }

    willGoOutOfBounds(): boolean {
        switch (this.position.direction) {
            case Direction.up:
                return this.position.y === 0;

            case Direction.left:
                return this.position.x === 0;

            case Direction.right:
                return this.position.x === gridXLength - 1;

            case Direction.down:
                return this.position.y === gridYLength - 1;
        }
    }

    changeDirection() {
        let nextGridSpace: Coordinates = {
            x: 0,
            y: 0,
            isObstacle: false,
            wasVisited: false,
        };

        try {
            switch (this.position.direction) {
                case Direction.up:
                    nextGridSpace =
                        grid[guard.position.y - 1][guard.position.x];

                    break;

                case Direction.left:
                    nextGridSpace =
                        grid[guard.position.y][guard.position.x - 1];

                    break;

                case Direction.right:
                    nextGridSpace =
                        grid[guard.position.y][guard.position.x + 1];

                    break;

                case Direction.down:
                    nextGridSpace =
                        grid[guard.position.y + 1][guard.position.x];

                    break;
            }

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_e) {
            /* empty */
        }

        if (nextGridSpace.isObstacle) {
            switch (this.position.direction) {
                case Direction.up:
                    this.position.direction = Direction.right;
                    break;
                case Direction.left:
                    this.position.direction = Direction.up;
                    break;
                case Direction.right:
                    this.position.direction = Direction.down;
                    break;
                case Direction.down:
                    this.position.direction = Direction.left;
                    break;
            }
        }
    }

    move() {
        this.changeDirection();
        this.changeDirection();
        this.changeDirection();

        switch (this.position.direction) {
            case Direction.up:
                this.position.y--;
                break;

            case Direction.left:
                this.position.x--;
                break;

            case Direction.right:
                this.position.x++;
                break;

            case Direction.down:
                this.position.y++;
                break;
        }

        grid[guard.position.y][guard.position.x].wasVisited = true;
    }
}

let guard: Guard;
let grid: Coordinates[][] = [];

let gridXLength = 0;
let gridYLength = 0;

function initializeGrid(addX?: number, addY?: number) {
    grid = [];

    for (const [y, line] of file.split("\n").entries()) {
        const coordinates: Coordinates[] = [];

        for (const [x, coordinate] of line.split("").entries()) {
            if (coordinate === "^") {
                guard = new Guard(x, y);
            }

            coordinates.push({
                x,
                y,
                isObstacle: coordinate === "#" || (x === addX && y === addY),
                wasVisited: false,
            });
        }

        grid.push(coordinates);
    }

    gridXLength = grid[0].length;
    gridYLength = grid.length;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _printGrid(specialCoordinate?: Coordinates) {
    for (const [y, line] of grid.entries()) {
        for (const [x, coordinate] of line.entries()) {
            let str;

            if (
                specialCoordinate &&
                coordinate.x === specialCoordinate.x &&
                coordinate.y === specialCoordinate.y
            ) {
                str = "O";
            } else if (coordinate.wasVisited) {
                str = "X";
            } else if (guard.position.x === x && guard.position.y === y) {
                str = guard.position.direction;
            } else if (coordinate.isObstacle) {
                str = "#";
            } else {
                str = ".";
            }

            process.stdout.write(str);
        }

        process.stdout.write("\n");
    }

    process.stdout.write("\n");
}

function traverse() {
    initializeGrid();

    grid[guard.position.y][guard.position.x].wasVisited = true;

    while (!guard.willGoOutOfBounds()) {
        guard.move();
    }

    grid[guard.position.y][guard.position.x].wasVisited = true;
}

function partOne(): void {
    traverse();

    let sum = 0;

    for (const line of grid) {
        sum += line.filter((c) => c.wasVisited).length;
    }

    console.log(sum);
}

function partTwo(): void {
    // We love bruteforcing, but we first cut down the number of coordinates to check to the ones actually visited.
    const coordinatesToCheck = [];

    traverse();

    for (const line of grid) {
        coordinatesToCheck.push(...line.filter((c) => c.wasVisited));
    }

    let loops = 0;

    for (const coordinate of coordinatesToCheck) {
        initializeGrid(coordinate.x, coordinate.y);

        const positionsVisited: Position[] = [];

        while (true) {
            positionsVisited.push({
                x: guard.position.x,
                y: guard.position.y,
                direction: guard.position.direction,
            });

            guard.move();

            if (
                positionsVisited.find(
                    (p) =>
                        p.x === guard.position.x &&
                        p.y === guard.position.y &&
                        p.direction === guard.position.direction
                ) !== undefined
            ) {
                loops++;
                break;
            }

            if (guard.willGoOutOfBounds()) {
                break;
            }
        }
    }

    console.log(loops);
}

partOne();
partTwo();

