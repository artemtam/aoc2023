const ELEVATIONS = 'abcdefghijklmnopqrstuvwxyz';

const CURRENT_POSITION = 'S';
const BEST_SIGNAL_POSITION = 'E';

const getElevation = (position: string): number => {
    if (position === CURRENT_POSITION) {
        return ELEVATIONS.indexOf('a');
    } else if (position === BEST_SIGNAL_POSITION) {
        return ELEVATIONS.indexOf('z');
    } else {
        return ELEVATIONS.indexOf(position);
    }
}

const findSmallestUnvisited = (unvisited: Set<number>, distances: number[]): number => {
    let smallestDistance = Infinity;
    let smallestDistanceIndex = -1;

    for (let v = 0; v < distances.length; v++) {
        if (smallestDistance > distances[v] && unvisited.has(v)) {
            smallestDistance = distances[v];
            smallestDistanceIndex = v;
        }
    }

    return smallestDistanceIndex;
}

// Dijkstra (based on https://en.wikipedia.org/wiki/Dijkstra%27s_algorithm#Algorithm)
// Could be more optimal with heap-based priority queue
const dijkstra = (startingNode: number, adjacencySets: Map<number, Set<number>>): number[] => {
    // Keep track of unvisited node

    const unvisited = new Set<number>(adjacencySets.keys());

    // Tentative distance values for each node (0 – if startingNode, Infinity – if any other node)

    const distances: number[] = [];

    // Fill in initial `unvisited` and `distances`

    for (const i of adjacencySets.keys()) {
        unvisited.add(i); // all are unvisited
        distances.push(i === startingNode ? 0 : Infinity); // 0 – if startingNode, Infinity – if any other node
    }

    while (unvisited.size > 0) {
        // Pick the smallest distance unvisited node (will be CURRENT_POSITION for the first iteration)

        let curr = findSmallestUnvisited(unvisited, distances);

        if (curr === -1) { // If no reachable nodes (distance = Infinity), the algorithm is finished
            break;
        }

        // Calculate all neighbors distances, filtering out visited

        for (const u of adjacencySets.get(curr)!) {
            if (unvisited.has(u)) {
                distances[u] = Math.min(distances[u], distances[curr] + 1);
            }
        }

        // Mark the current node as visited

        unvisited.delete(curr);
    }

    return distances;
}

const solvePart1 = (input: string): number => {
    const heightmap = input.split('\n').map((line) => line.split(''));

    const H = heightmap.length;
    const W = heightmap[0].length;

    // Build adjacency list (no need to store anything except node indexes)

    const adjacencySets: Map<number, Set<number>> = new Map(); // nodeIndex => Set<nodeIndex, nodeIndex, ...>

    let startingNode = -1; // CURRENT_POSITION index in adjacencySets

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) { // for each height
            const i = y * W + x;
            const set = new Set<number>();

            // check all 4 siblings

            if (x + 1 < W && (getElevation(heightmap[y][x + 1]) - getElevation(heightmap[y][x]) <= 1)) {
                set.add(y * W + x + 1);
            }

            if (x - 1 >= 0 && (getElevation(heightmap[y][x - 1]) - getElevation(heightmap[y][x]) <= 1)) {
                set.add(y * W + x - 1);
            }

            if (y + 1 < H && (getElevation(heightmap[y + 1][x]) - getElevation(heightmap[y][x]) <= 1)) {
                set.add((y + 1) * W + x);
            }

            if (y - 1 >= 0 && (getElevation(heightmap[y - 1][x]) - getElevation(heightmap[y][x]) <= 1)) {
                set.add((y - 1) * W + x);
            }

            if (heightmap[y][x] === CURRENT_POSITION) {
                startingNode = i;
            }

            adjacencySets.set(i, set);
        }
    }

    // Count all shortest distances

    const distances = dijkstra(startingNode, adjacencySets);

    // Find distance to BEST_SIGNAL_POSITION

    return distances.find((distance, i) => {
        const x = i % W;
        const y = Math.floor(i / W);

        return heightmap[y][x] === BEST_SIGNAL_POSITION;
    })!;
};

const solvePart2 = (input: string): number => {
    const heightmap = input.split('\n').map((line) => line.split(''));

    const H = heightmap.length;
    const W = heightmap[0].length;

    // Build adjacency list

    const adjacencySets: Map<number, Set<number>> = new Map(); // nodeIndex => Set<nodeIndex, nodeIndex, ...>

    let startingNode = -1; // BEST_SIGNAL_POSITION index in adjacencySets

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            const i = y * W + x;
            const set = new Set<number>();

            // check all 4 siblings
            // this time we will be traversing in reverse, so we compare elevations vise-versa too

            if (x + 1 < W && (getElevation(heightmap[y][x]) - getElevation(heightmap[y][x + 1]) <= 1)) {
                set.add(y * W + x + 1);
            }

            if (x - 1 >= 0 && (getElevation(heightmap[y][x]) - getElevation(heightmap[y][x - 1]) <= 1)) {
                set.add(y * W + x - 1);
            }

            if (y + 1 < H && (getElevation(heightmap[y][x]) - getElevation(heightmap[y + 1][x]) <= 1)) {
                set.add((y + 1) * W + x);
            }

            if (y - 1 >= 0 && (getElevation(heightmap[y][x]) - getElevation(heightmap[y - 1][x]) <= 1)) {
                set.add((y - 1) * W + x);
            }

            if (heightmap[y][x] === BEST_SIGNAL_POSITION) {
                startingNode = i;
            }

            adjacencySets.set(i, set);
        }
    }

    // Count all shortest distances

    const distances = dijkstra(startingNode, adjacencySets);

    // Find the closest `a`

    let minDistance = Number.MAX_SAFE_INTEGER;

    for (let i = 0; i < distances.length; i++) {
        const x = i % W;
        const y = Math.floor(i / W);

        if (heightmap[y][x] === 'a' && distances[i] < minDistance) {
            minDistance = distances[i];
        }
    }

    return minDistance;
};

export { solvePart1, solvePart2 };