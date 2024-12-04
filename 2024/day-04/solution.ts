export const solvePart1 = (input: string): number => {
    const m = input.split('\n').map((line) => {
        return line.split('');
    });

    let result = 0;

    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            // if encounter the first letter (X) -> check all 8 word directions

            if (m[y][x] === 'X') {
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        if (
                          'X' === m[y]?.[x] &&
                          'M' === m[y + dy]?.[x + dx] &&
                          'A' === m[y + 2 * dy]?.[x + 2 * dx] &&
                          'S' === m[y + 3 * dy]?.[x + 3 * dx]
                        ) {
                            result += 1;
                        }
                    }
                }
            }
        }
    }

    return result;
};

export const solvePart2 = (input: string): number => {
    const m = input.trim().split('\n').map((line) => {
        return line.trim().split('');
    });

    let result = 0;

    for (let y = 0; y < m.length; y++) {
        for (let x = 0; x < m[y].length; x++) {
            // if encounter the middle letter (A) -> check all 4 shape rotations

            if (m[y][x] === 'A') {
                // skip if A is too close to the edge (no space for M and S)

                if (x < 1 || x >= m[0].length - 1 || y < 1 || y >= m.length - 1) {
                    continue;
                }

                if (
                  (m[y - 1][x - 1] === 'M' && m[y - 1][x + 1] === 'M' && m[y + 1][x - 1] === 'S' && m[y + 1][x + 1] === 'S') ||
                  (m[y - 1][x - 1] === 'S' && m[y - 1][x + 1] === 'S' && m[y + 1][x - 1] === 'M' && m[y + 1][x + 1] === 'M') ||
                  (m[y - 1][x - 1] === 'S' && m[y - 1][x + 1] === 'M' && m[y + 1][x - 1] === 'S' && m[y + 1][x + 1] === 'M') ||
                  (m[y - 1][x - 1] === 'M' && m[y - 1][x + 1] === 'S' && m[y + 1][x - 1] === 'M' && m[y + 1][x + 1] === 'S')
                ) {
                    result += 1;
                }
            }
        }
    }

    return result;
};
