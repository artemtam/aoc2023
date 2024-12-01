export const solvePart1 = (input: string): number => {
    let total = 0;

    const entries = input.trim().split('\n').map((line) => {
        return line.split(' ').map(Number);
    });

    for (const values of entries) {
        let i = 0;

        // record last values in the entry for each iteration
        const trailingValues: number[] = [];

        // iterate while all values are not equal 0

        while (true) {
            // count the diff and update the first value in place
            values[i] = values[i + 1] - values[i];

            i += 1;

            // handle end of values

            if (i === values.length - 1) {
                // remove the last one, as it's diff was written to the one before
                trailingValues.push(values.pop()!);
                i = 0;

                // check if all values are 0, if yes -> finish loop
                if (values.every(v => v === 0)) {
                    break;
                }
            }
        }

        /**
         *         a ->  a + (b + c + d) = Σ(a,b,c,d) // just a sum
         *       b ->  b + (c + d)
         *     c  ->  c + (d)
         *   d  ->  d + (0) = d
         * 0
         */

        for (const value of trailingValues) {
            total += value;
        }
    }

    return total;
};

export const solvePart2 = (input: string): number => {
    let total = 0;

    const entries = input.trim().split('\n').map((line) => {
        return line.split(' ').map(Number);
    });

    for (const values of entries) {
        let i = 0;

        // record first values in the entry for each iteration
        const leadingValues: number[] = [];

        while (!values.every(v => v === 0)) {
            if (i === 0) {
                leadingValues.push(values[i]);
            }

            values[i] = values[i + 1] - values[i];
            i += 1;

            if (i === values.length - 1) { // end of list
                values.pop();
                i = 0;
            }
        }

        /**
         * a - (b - (c - d))  <-  a    // = (a - b + c - d) - just a sum, but alternating sign
         *         b - (c - d)  <-  b
         *               c - (d)  <-  c
         *                  d - (0) <-  d
         *                                0
         */

        for (let i = 0; i < leadingValues.length; i++) {
            const sign = i % 2 === 0 ? 1 : -1;
            total += sign * leadingValues[i];
        }
    }

    return total;
};
