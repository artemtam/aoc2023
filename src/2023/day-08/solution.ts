const NETWORK_LINE_REGEXP = /(?<source>[A-Z\d]{3}) = \((?<targetLeft>[A-Z\d]{3}), (?<targetRight>[A-Z\d]{3})\)/;

export const solvePart1 = (input: string): number => {
    const [instructions, _, ...network] = input.trim().split('\n');

    // parse network & fill adjLists (node => [nodeLeft, nodeRight])

    const adjLists = new Map<string, [string, string]>();

    for (const line of network) {
        const { source, targetLeft, targetRight } = NETWORK_LINE_REGEXP.exec(line)?.groups!;
        adjLists.set(source, [targetLeft, targetRight]);
    }

    // execute instructions until currentNode is not ZZZ

    let i = 0;
    let currentNode = 'AAA';

    while (currentNode !== 'ZZZ') {
        const inst = instructions[i % instructions.length]; // L or R
        currentNode = adjLists.get(currentNode)![inst === 'L' ? 0 : 1];

        i += 1;
    }

    return i;
};

export const solvePart2 = (input: string): number => {
    const [instructions, _, ...network] = input.trim().split('\n');

    // parse network & fill adjLists (node => [nodeLeft, nodeRight])

    const adjLists = new Map<string, [string, string]>();
    const startNodes: string[] = [];

    for (const line of network) {
        const { source, targetLeft, targetRight } = NETWORK_LINE_REGEXP.exec(line)?.groups!;
        adjLists.set(source, [targetLeft, targetRight]);

        // add node to startNodes for later

        if (source[2] === 'A') { // faster than String.endsWith
            startNodes.push(source);
        }
    }

    // calculate steps to reach end (a node ending with Z) for each node

    let stepsToReachEnd: number[] = Array(startNodes.length).fill(-1);

    for (let j = 0; j < startNodes.length; j++) {
        let i = 0;
        let currentNode = startNodes[j];

        while (!(currentNode[2] === 'Z')) { // faster than String.endsWith
            const inst = instructions[i % instructions.length]; // L or R
            currentNode = adjLists.get(currentNode)![inst === 'L' ? 0 : 1];

            i += 1;
        }

        stepsToReachEnd[j] = i;
    }

    // all paths will reach end at the i equals the Least Common Multiple (lcm) of stepsToReachEnd

    return lcmN(...stepsToReachEnd);
};


/**
 * Greatest common delimiter of a and b
 * Based on https://en.wikipedia.org/wiki/Euclidean_algorithm#Implementations
 */
const gdc = (a: number, b: number): number => {
    while (b !== 0) {
        const t = b;
        b = a % b;
        a = t;
    }

    return a;
}

/**
 * Least Common Multiple of a and b
 * Based on https://en.wikipedia.org/wiki/Least_common_multiple#Using_the_greatest_common_divisor
 */
const lcm = (a: number, b: number): number => {
    return a * (b / gdc(a, b));
}


/**
 * Least Common Multiple of N numbers
 */
const lcmN = (...numbers: number[]): number => {
    let m = 1;

    for (const number of numbers) {
        m = lcm(m, number);
    }

    return m;
}
