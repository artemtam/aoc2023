export const solve = (input: string, expansion: number): number => {
    const image = input.trim().split('\n');

    // keep track of rows & cols without galaxies
    // -> pre-fill with all rows & cols

    let rowsWithoutGalaxies = new Set(Array.from({length: image.length}, (_, i) => i));
    let colsWithoutGalaxies = new Set(Array.from({length: image[0].length}, (_, i) => i));

    // remove rows & cols with at least 1 galaxy

    for (let y = 0; y < image.length; y++) {
        for (let x = 0; x < image[0].length; x++) {
            if (image[y][x] === '#') {
                rowsWithoutGalaxies.delete(y);
                colsWithoutGalaxies.delete(x);
            }
        }
    }

    // record all galaxies coordinates to an array

    const galaxies: number[][] = [];

    for (let y= 0, yExpanded = 0; y < image.length; y++, yExpanded++) {
        if (rowsWithoutGalaxies.has(y)) {
            yExpanded += expansion;
        }

        for (let x = 0, xExpanded = x; x < image[0].length; x++, xExpanded++) {
            if (colsWithoutGalaxies.has(x)) {
                xExpanded += expansion;
            }

            if (image[y][x] === '#') {
                galaxies.push([yExpanded, xExpanded]);
            }
        }
    }

    // calculate paths between all galaxies and add to the sum

    let sumOfPaths = 0;

    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i; j < galaxies.length; j++) {
            sumOfPaths += Math.abs(galaxies[j][0] - galaxies[i][0]) + Math.abs(galaxies[j][1] - galaxies[i][1]);
        }
    }

    return sumOfPaths;
};

export const solvePart1 = (input: string): number => {
    return solve(input, 1); // +1 row = 2
}

export const solvePart2 = (input: string): number => {
    return solve(input, 999_999); // +999,999 rows = 1,000,000
};
