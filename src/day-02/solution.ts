export const solvePart1 = (input: string): number => {
    let sumPossibleGameIDs = 0;

    const cubesTotal = {
        red: 12,
        green: 13,
        blue: 14,
    }

    const games = input.trim().split('\n');

    for (const game of games) {
        let possible = true;

        // parse game string

        const [gameTitle, gameResults] = game.split(': ');
        const gameId = Number(gameTitle.split(' ')[1]);
        const subsets  = gameResults.split('; ');

        // iterate over subsets

        for (const subset of subsets) {
            const results = subset.split(', ');

            // iterate over result for each color & compare

            for (const result of results) {
                const count = Number(result.split(' ')[0]);
                const color = result.split(' ')[1] as keyof typeof cubesTotal;

                if (count > cubesTotal[color]) {
                    possible = false;
                    break;
                }
            }

            // exit if marked as not possible

            if (!possible) {
                break;
            }
        }

        if (possible) {
            sumPossibleGameIDs += gameId;
        }
    }

    return sumPossibleGameIDs;
};

export const solvePart2 = (input: string): number => {
    let totalPower = 0;

    const games = input.trim().split('\n');

    for (const game of games) {
        // parse game string

        const [_, gameResults] = game.split(': ');
        const subsets  = gameResults.split('; ');

        const fewestCubesTotal = {
            red: 0,
            green: 0,
            blue: 0,
        }

        // iterate over subsets

        for (const subset of subsets) {
            const results = subset.split(', ');

            // iterate over result for each color & count min cubes

            for (const result of results) {
                const count = Number(result.split(' ')[0]);
                const color = result.split(' ')[1] as keyof typeof fewestCubesTotal;

                fewestCubesTotal[color] = Math.max(fewestCubesTotal[color], count);
            }
        }

        totalPower += fewestCubesTotal.red * fewestCubesTotal.blue * fewestCubesTotal.green
    }

    return totalPower;
};
