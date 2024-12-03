/**
 * Checks if tree (x0, y0) is visible from the outside of the treeMatrix grid (part 1)
 */
const isVisible = (treeMatrix: number[][], H: number, W: number, y0: number, x0: number): boolean => {
    // if edges -> visible

    if (y0 === 0 || x0 === 0 || y0 === H - 1 || x0 === W - 1) {
        return true;
    }

    // check if visible from each side

    let topVisible = true;
    let bottomVisible = true;
    let leftVisible = true;
    let rightVisible = true;

    for (let x = 0; x < x0; x++) {
        if (treeMatrix[y0][x] >= treeMatrix[y0][x0]) {
            leftVisible = false;
        }
    }

    for (let x = x0 + 1; x < W; x++) {
        if (treeMatrix[y0][x] >= treeMatrix[y0][x0]) {
            rightVisible = false;
        }
    }

    for (let y = 0; y < y0; y++) {
        if (treeMatrix[y][x0] >= treeMatrix[y0][x0]) {
            topVisible = false;
        }
    }

    for (let y = y0 + 1; y < H; y++) {
        if (treeMatrix[y][x0] >= treeMatrix[y0][x0]) {
            bottomVisible = false;
        }
    }

    // if visible from any side -> visible

    return topVisible || bottomVisible || leftVisible || rightVisible;
}

/**
 * Returns the (x0, y0) tree's scenic score (based on how many trees are visible from it) (part 2)
 */
const countVisibilityScore = (treeMatrix: number[][], H: number, W: number, y0: number, x0: number): number => {
    // count how many trees visible to each side

    let topVisible = 0;
    let bottomVisible = 0;
    let leftVisible = 0;
    let rightVisible = 0;

    for (let x = x0 - 1; x >= 0; x--) {
        leftVisible++;

        if (treeMatrix[y0][x] >= treeMatrix[y0][x0]) {
            break;
        }
    }

    for (let x = x0 + 1; x < W; x++) {
        rightVisible++;

        if (treeMatrix[y0][x] >= treeMatrix[y0][x0]) {
            break;
        }
    }

    for (let y = y0 - 1; y >= 0; y--) {
        topVisible++;

        if (treeMatrix[y][x0] >= treeMatrix[y0][x0]) {
            break;
        }
    }

    for (let y = y0 + 1; y < H; y++) {
        bottomVisible++

        if (treeMatrix[y][x0] >= treeMatrix[y0][x0]) {
            break;
        }
    }

    // multiply to get the tree's scenic score

    return topVisible * bottomVisible * leftVisible * rightVisible;
}

const solve = (input: string): [number, number] => {
    // parse input to treeHeight[][] matrix

    const treeMatrix = input.split('\n').map((row) => {
        return row.split('').map(Number);
    });

    const W = treeMatrix[0].length;
    const H = treeMatrix.length;

    let totalVisibleFromOutside = 0;
    let maxVisibilityScenicScore = 0;

    // for each tree, check visibility and count scenic score

    for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
            if (isVisible(treeMatrix, H, W, y, x)) {
                totalVisibleFromOutside++;
            }

            maxVisibilityScenicScore = Math.max(
                maxVisibilityScenicScore,
                countVisibilityScore(treeMatrix, H, W, y, x),
            );
        }
    }

    return [totalVisibleFromOutside, maxVisibilityScenicScore];
};

const solvePart1 = (input: string): number => {
    const [totalVisibleFromOutside] = solve(input);

    return totalVisibleFromOutside;
};

const solvePart2 = (input: string): number => {
    const [_, maxVisibilityScenicScore] = solve(input);

    return maxVisibilityScenicScore;
};

export { solvePart1, solvePart2 };