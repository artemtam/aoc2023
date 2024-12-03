const solve = (input: string): [number, number] => {
    const pairs = input.split('\n');

    let fullOverlaps = 0;
    let restOfOverlaps = 0;

    pairs.forEach((pair) => {
        const [elf1Range, elf2Range] = pair.split(',');

        const [elf1Left, elf1Right] = elf1Range.split('-').map(Number);
        const [elf2Left, elf2Right] = elf2Range.split('-').map(Number);

        if ((elf1Left >= elf2Left && elf1Right <= elf2Right) || (elf2Left >= elf1Left && elf2Right <= elf1Right)) {
            fullOverlaps++;
        } else if ((elf1Left >= elf2Left && elf1Left <= elf2Right) || (elf1Right >= elf2Left && elf1Right <= elf2Right)) {
            restOfOverlaps++;
        }
    });

    return [fullOverlaps, restOfOverlaps];
};

const solvePart1 = (input: string): number => {
    const [fullOverlaps] = solve(input);
    return fullOverlaps;
};

const solvePart2 = (input: string): number => {
    const [fullOverlaps, restOfOverlaps] = solve(input);
    return fullOverlaps + restOfOverlaps;
};

export { solvePart1, solvePart2 };