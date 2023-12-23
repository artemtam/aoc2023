/**
 * Checks if rows is a perfect reflection over y
 * @param rows
 * @param y
 * @param fixTile - true for Part 2 - try to autofix incorrect tile
 */
const isPerfectReflectionY = (rows: string[], y: number, fixTile: boolean): boolean => {
    let a = y;
    let b = y + 1;

    let tileFixed = false;

    while (a >= 0 && b < rows.length) {
        for (let x = 0; x < rows[0].length; x++) {
            if (rows[a][x] !== rows[b][x]) {
                if (fixTile && !tileFixed) { // fix tile only once
                    tileFixed = true;
                    continue;
                }

                return false;
            }
        }

        a--;
        b++;
    }

    return fixTile ? tileFixed : true; // for Part 2 return true only if tile was fixed
}

/**
 * Checks if rows is a perfect reflection over x
 * @param rows
 * @param x
 * @param fixTile - true for Part 2 - try to autofix incorrect tile
 */
const isPerfectReflectionX = (rows: string[], x: number, fixTile: boolean): boolean => {
    let a = x;
    let b = x + 1;

    let tileFixed = false;

    while (a >= 0 && b < rows[0].length) {
        for (let y = 0; y < rows.length; y++) {
            if (rows[y][a] !== rows[y][b]) {
                if (fixTile && !tileFixed) { // fix tile only once
                    tileFixed = true;
                    continue;
                }

                return false;
            }
        }

        a--;
        b++;
    }

    return fixTile ? tileFixed : true;
}

export const solvePart1 = (input: string): number => {
    let result = 0;

    const patterns = input.trim().split('\n\n');

    for (const pattern of patterns) {
        const rows = pattern.split('\n');

        for (let y = 0; y < rows.length - 1; y++) {
            if (isPerfectReflectionY(rows, y, false)) {
                result += (y + 1) * 100;
                break;
            }
        }

        for (let x = 0; x < rows[0].length - 1; x++) {
            if (isPerfectReflectionX(rows, x, false)) {
                result += x + 1;
                break;
            }
        }
    }

    return result;
}


export const solvePart2 = (input: string): number => {
    let result = 0;

    const patterns = input.trim().split('\n\n');

    for (const pattern of patterns) {
        const rows = pattern.split('\n');

        for (let y = 0; y < rows.length - 1; y++) {
            if (isPerfectReflectionY(rows, y, true)) {
                result += (y + 1) * 100;
                break;
            }
        }

        for (let x = 0; x < rows[0].length - 1; x++) {
            if (isPerfectReflectionX(rows, x, true)) {
                result += x + 1;
                break;
            }
        }
    }

    return result;
};
