/**
 * Cave is an object that stores the state of the cave.
 * It keeps track of all occupied coordinates in there (by rocks or by sand).
 */
class Cave {
    /**
     * I think, the most optimal data structure could be 2-dimensional binary tree aka point quadtree.
     *
     * Current implementation is Map<Set> (lookups should be sublinear). It's quite fast comparing to just a Set,
     * and consumes way less space comparing to a 2D array of the cave.
     */
    private occupiedCoordinates: Map<number, Set<number>>;
    public yBottom: number;

    constructor() {
        this.occupiedCoordinates = new Map();
        this.yBottom = 0;
    }

    /**
     * Marks (x, y) as occupied
     */
    public addEntity(x: number, y: number): void {
        if (y > this.yBottom) {
            this.yBottom = y;
        }

        if (!this.occupiedCoordinates.has(x)) {
            this.occupiedCoordinates.set(x, new Set());
        }

        this.occupiedCoordinates.get(x)!.add(y);
    }

    /**
     * Checks if (x, y) is occupied
     */
    public hasEntity(x: number, y: number): boolean {
        return !!this.occupiedCoordinates.get(x)?.has(y);
    }
}

/**
 * Parses input to a Cave
 */
const parseInputToSpace = (input: string): Cave => {
    const cave = new Cave();

    input.split('\n').forEach((rockPathStr) => {
        // we store previous rock coordinates to fill in the path to the next one

        let prevRockCoords: [number, number] | null = null;

        rockPathStr.split(' -> ').forEach((rockPathCoords) => {
            const [x, y] = rockPathCoords.split(',').map(Number);

            // if prevCoordinates, then fill the entire path

            if (prevRockCoords !== null) {
                const [prevX, prevY] = prevRockCoords;

                const dx = Math.sign(x - prevX);
                const dy = Math.sign(y - prevY);

                let x0 = prevX;
                let y0 = prevY;

                while (x0 != x) {
                    cave.addEntity(x0, y);
                    x0 += dx;
                }

                while (y0 != y) {
                    cave.addEntity(x, y0);
                    y0 += dy;
                }
            }

            cave.addEntity(x, y);

            prevRockCoords = [x, y];
        });
    });

    return cave;
}

/**
 * Simulates dropping a sand and occupies its final position in a cave.
 * @param firmBottomAt – y coordinate of a firm bottom (if exists)
 * @returns true – if sand landed, false – if can not drop or nowhere to land
 */
const dropSand = (cave: Cave, x0: number, y0 :number, firmBottomAt?: number): boolean => {
    let x = x0;
    let y = y0;

    // simulating sand falling, one level at a time

    while (y < (firmBottomAt ?? cave.yBottom)) { // stop if bottom reached
        if (!cave.hasEntity(x, y + 1)) {
            y += 1;
        } else if (!cave.hasEntity(x - 1, y + 1)) {
            y += 1;
            x -= 1
        } else if (!cave.hasEntity(x + 1, y + 1)) {
            x += 1;
            y += 1;
        } else { // nowhere to go => landed successfully
            cave.addEntity(x, y);

            if (x === x0 && y === y0) { // if starting coordinates, stop
                return false;
            }

            return true;
        }
    }

    if (firmBottomAt) { // if firm bottom, then landed successfully
        cave.addEntity(x, y);
        return true;
    }

    return false;
}

const solvePart1 = (input: string): number => {
    const cave = parseInputToSpace(input);

    let countDropped = 0;

    while (dropSand(cave,500, 0)) {
        countDropped++;
    }

    return countDropped;
};

const solvePart2 = (input: string): number => {
    const cave = parseInputToSpace(input);

    let countDropped = 0;

    const firmBottomAt = cave.yBottom + 1;

    while (dropSand(cave,500, 0, firmBottomAt)) {
        countDropped++;
    }

    return countDropped;
};

export { solvePart1, solvePart2 };