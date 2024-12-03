const solve = (input: string, uniqueCount: number): number => {
    const uniqueCharacters: string[] = []; // sliding window

    for (let i = 0; i < input.length; i++) {
        const ch = input[i];

        if (uniqueCharacters.includes(ch)) { // if exists -> remove all before the one (including it) and continue
            const repeatedChIndex = uniqueCharacters.indexOf(ch);
            uniqueCharacters.splice(0, repeatedChIndex + 1);
        }

        uniqueCharacters.push(ch);

        if (uniqueCharacters.length === uniqueCount) {
            return i + 1;
        }
    }

    throw new Error(`A marker of ${uniqueCount} unique characters not found`);
}

const solvePart1 = (input: string): number => {
    return solve(input, 4);
};

const solvePart2 = (input: string): number => {
    return solve(input, 14);
};

export { solvePart1, solvePart2 };