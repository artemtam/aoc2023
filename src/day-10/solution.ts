enum Tile {
    VerticalPipe = '|',
    HorizontalPipe = '-',
    NinetyBendNE = 'L',
    NinetyBendNW = 'J',
    NinetyBendSW = '7',
    NinetyBendSE = 'F',
    Ground = '.',
    StartingPosition = 'S',
}

export const solvePart1 = (input: string): number => {
    // parse input, find starting position & build a graph to adjSets

    let startX = -1;
    let startY = -1;

    const adjSets = new Map<string, string[]>();
    const getKey = (x: number, y: number): string => x + ',' + y;

    const rows = input.trim().split('\n');

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            let adjacents: string[];

            switch (rows[y][x]) {
                case Tile.Ground:
                    continue;

                case Tile.StartingPosition:
                    startX = x;
                    startY = y;

                    adjacents = [];

                    if (rows[y][x + 1] === Tile.HorizontalPipe || rows[y][x + 1] === Tile.NinetyBendSW || rows[y][x + 1] === Tile.NinetyBendNW) {
                        adjacents.push(getKey(x + 1, y));
                    }

                    if (rows[y - 1][x] === Tile.VerticalPipe || rows[y - 1][x] === Tile.NinetyBendSE || rows[y - 1][x] === Tile.NinetyBendSW) {
                        adjacents.push(getKey(x, y - 1));
                    }

                    if (rows[y][x - 1] === Tile.HorizontalPipe || rows[y][x - 1] === Tile.NinetyBendSE || rows[y][x - 1] === Tile.NinetyBendNE) {
                        adjacents.push(getKey(x - 1, y));
                    }

                    if (rows[y + 1][x] === Tile.VerticalPipe || rows[y + 1][x] === Tile.NinetyBendNE || rows[y + 1][x] === Tile.NinetyBendNW) {
                        adjacents.push(getKey(x, y + 1));
                    }

                    break;

                case Tile.HorizontalPipe:
                    adjacents = [getKey(x - 1, y), getKey(x + 1, y)];
                    break;

                case Tile.VerticalPipe:
                    adjacents = [getKey(x, y - 1), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendSW:
                    adjacents = [getKey(x - 1, y), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendNW:
                    adjacents = [getKey(x - 1, y), getKey(x, y - 1)];
                    break;

                case Tile.NinetyBendSE:
                    adjacents = [getKey(x + 1, y), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendNE:
                    adjacents = [getKey(x + 1, y), getKey(x, y - 1)];
                    break;

                default:
                    throw new Error();
            }

            adjSets.set(getKey(x, y), adjacents);
        }
    }

    // traverse the graph in different directions simultaneously
    // -> cursors will meet at the farthest point

    const startKey = getKey(startX, startY);

    let [a, b] = adjSets.get(startKey)!;
    let prevA= startKey, prevB = startKey;

    let distance = 0;

    while (a !== b) {
        const adjsA = adjSets.get(a)!;
        const adjsB = adjSets.get(b)!;

        const nextA = adjsA[0] === prevA ? adjsA[1] : adjsA[0];
        const nextB = adjsB[0] === prevB ? adjsB[1] : adjsB[0];

        prevA = a;
        a = nextA;

        prevB = b;
        b = nextB;

        distance++;
    }

    return distance + 1;
};

export const solvePart2 = (input: string): number => {
    // parse input, find starting position & build a graph to adjSets

    let startX = -1;
    let startY = -1;

    const adjSets = new Map<string, string[]>();
    const getKey = (x: number, y: number): string => x + ',' + y;

    const rows = input.trim().split('\n');
    const parseKey = (key: string): number[] => key.split(',').map(Number);

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            let adjacents: string[];

            switch (rows[y][x]) {
                case Tile.Ground:
                    continue;

                case Tile.StartingPosition:
                    startX = x;
                    startY = y;

                    adjacents = [];

                    if (rows[y][x + 1] === Tile.HorizontalPipe || rows[y][x + 1] === Tile.NinetyBendSW || rows[y][x + 1] === Tile.NinetyBendNW) {
                        adjacents.push(getKey(x + 1, y));
                    }

                    if (rows[y - 1]?.[x] === Tile.VerticalPipe || rows[y - 1]?.[x] === Tile.NinetyBendSE || rows[y - 1]?.[x] === Tile.NinetyBendSW) {
                        adjacents.push(getKey(x, y - 1));
                    }

                    if (rows[y][x - 1] === Tile.HorizontalPipe || rows[y][x - 1] === Tile.NinetyBendSE || rows[y][x - 1] === Tile.NinetyBendNE) {
                        adjacents.push(getKey(x - 1, y));
                    }

                    if (rows[y + 1][x] === Tile.VerticalPipe || rows[y + 1][x] === Tile.NinetyBendNE || rows[y + 1][x] === Tile.NinetyBendNW) {
                        adjacents.push(getKey(x, y + 1));
                    }

                    break;

                case Tile.HorizontalPipe:
                    adjacents = [getKey(x - 1, y), getKey(x + 1, y)];
                    break;

                case Tile.VerticalPipe:
                    adjacents = [getKey(x, y - 1), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendSW:
                    adjacents = [getKey(x - 1, y), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendNW:
                    adjacents = [getKey(x - 1, y), getKey(x, y - 1)];
                    break;

                case Tile.NinetyBendSE:
                    adjacents = [getKey(x + 1, y), getKey(x, y + 1)];
                    break;

                case Tile.NinetyBendNE:
                    adjacents = [getKey(x + 1, y), getKey(x, y - 1)];
                    break;

                default:
                    throw new Error();
            }

            adjSets.set(getKey(x, y), adjacents);
        }
    }

    // traverse the graph and remember all nodes that are a part of loop

    const loopTiles = new Set<string>();

    let previous = getKey(startX, startY);
    let cursor = adjSets.get(getKey(startX, startY))![0];

    do {
        loopTiles.add(cursor);

        const adjs = adjSets.get(cursor)!;
        const next = previous === adjs[0] ? adjs[1] : adjs[0];

        previous = cursor;
        cursor = next;
    } while (cursor !== getKey(startX, startY));

    for (let y = 0; y < rows.length; y++) {
        for (let x = 0; x < rows[y].length; x++) {
            if (rows[y][x] !== Tile.Ground && rows[y][x] !== Tile.StartingPosition && !loopTiles.has(getKey(x, y))) {
                const test = rows[y].split('');
                test.splice(x, 1, Tile.Ground);
                rows[y] = test.join('');
            }
        }
    }


    // parse input, find starting position & build a graph to adjSets

    enum ZoomedTile {
        Ground = '.',
        Path = '*',
        Pipe = '█',
    }

    const tileZoomed = {
        [Tile.Ground]: [
            [ZoomedTile.Ground, ZoomedTile.Ground, ZoomedTile.Ground],
            [ZoomedTile.Ground, ZoomedTile.Ground, ZoomedTile.Ground],
            [ZoomedTile.Ground, ZoomedTile.Ground, ZoomedTile.Ground],
        ],
        [Tile.HorizontalPipe]: [
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Pipe],
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
        ],
        [Tile.VerticalPipe]: [
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
        ],
        [Tile.NinetyBendNW]: [
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
        ],
        [Tile.NinetyBendNE]: [
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Pipe],
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
        ],
        [Tile.NinetyBendSW]: [
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
        ],
        [Tile.NinetyBendSE]: [
            [ZoomedTile.Path, ZoomedTile.Path, ZoomedTile.Path],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Pipe],
            [ZoomedTile.Path, ZoomedTile.Pipe, ZoomedTile.Path],
        ],
        [Tile.StartingPosition]: [
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Pipe],
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Pipe],
            [ZoomedTile.Pipe, ZoomedTile.Pipe, ZoomedTile.Pipe],
        ]
    }

    const zoomedGrid = new Array(rows.length * 3);

    let groundTotal = 0;

    for (let y = 0; y < rows.length; y++) {
        zoomedGrid[y * 3] = new Array(rows[0].length * 3).fill(-1);
        zoomedGrid[y * 3 + 1] = new Array(rows[0].length * 3).fill(-1);
        zoomedGrid[y * 3 + 2] = new Array(rows[0].length * 3).fill(-1);

        for (let x = 0; x < rows[y].length; x++) {
            const tile = rows[y][x] as Tile;

            if (tile === Tile.Ground) {
                groundTotal += 9;
            }

            zoomedGrid[y * 3][x * 3] = tileZoomed[tile][0][0];
            zoomedGrid[y * 3][x * 3 + 1] = tileZoomed[tile][0][1];
            zoomedGrid[y * 3][x * 3 + 2] = tileZoomed[tile][0][2];

            zoomedGrid[y * 3 + 1][x * 3] = tileZoomed[tile][1][0];
            zoomedGrid[y * 3 + 1][x * 3 + 1] = tileZoomed[tile][1][1];
            zoomedGrid[y * 3 + 1][x * 3 + 2] = tileZoomed[tile][1][2];

            zoomedGrid[y * 3 + 2][x * 3] = tileZoomed[tile][2][0];
            zoomedGrid[y * 3 + 2][x * 3 + 1] = tileZoomed[tile][2][1];
            zoomedGrid[y * 3 + 2][x * 3 + 2] = tileZoomed[tile][2][2];

        }
    }

    const visited = new Set<string>();

    let groundReached = 0;

    for (let y = 0; y < 1; y += rows.length - 1) {
        for (let x = 0; x < rows[0].length; x++) {
            if (zoomedGrid[y][x] === ZoomedTile.Pipe || visited.has(getKey(x, y))) {
                continue;
            }

            const stack = [getKey(x, y)];

            while (stack.length > 0) {
                const current = stack.pop()!;

                if (visited.has(current)) {
                    continue;
                }

                visited.add(current);

                const [x, y] = parseKey(current);

                if (zoomedGrid[y][x] === ZoomedTile.Ground) {
                    groundReached += 1;
                }

                if (x < zoomedGrid[0].length - 1 && zoomedGrid[y]?.[x + 1] !== ZoomedTile.Pipe) {
                    stack.push(getKey(x + 1, y));
                }

                if (x > 0 && zoomedGrid[y]?.[x - 1] !== ZoomedTile.Pipe) {
                    stack.push(getKey(x - 1, y));
                }

                if (y < zoomedGrid.length - 1 && zoomedGrid[y + 1]?.[x] !== ZoomedTile.Pipe) {
                    stack.push(getKey(x, y + 1));
                }

                if (y > 0 && zoomedGrid[y - 1]?.[x] !== ZoomedTile.Pipe) {
                    stack.push(getKey(x, y - 1));
                }
            }
        }
    }

    return (groundTotal - groundReached) / 9;
};
