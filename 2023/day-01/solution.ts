/**
 * Parses integer from string. Returns null if not an integer.
 * @param str
 */
const parseDigit = (str: string): number | null => {
    const digit = Number(str);
    return !Number.isNaN(digit) ? digit : null;
}

export const solvePart1 = (input: string): number => {
    let total = 0;
    const lines = input.trim().split('\n');

    for (const line of lines) {
        // set up 2 pointers

        let left = 0;
        let right = line.length - 1;

        let firstDigit: number | null = null;
        let lastDigit: number | null = null;

        // approach from both sides of the line until both digits are found

        while ((firstDigit === null || lastDigit === null) && (left < line.length && right >= 0)) {
            if (firstDigit === null) {
                firstDigit = parseDigit(line[left]);
                left++;
            }

            if (lastDigit === null) {
                lastDigit = parseDigit(line[right]);
                right--;
            }
        }

        // handle unexpected case when either of digits not found

        if (firstDigit === null || lastDigit === null) {
            throw new Error(`Can not find both digits in line: ${line}`);
        }

        // add to the total

        total += firstDigit * 10 + lastDigit;
    }

    return total;
};

const SPELLED_DIGITS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];

/**
 * Parses integer from spelled digit string. Returns null if not a digit.
 * @param str
 */
const parseSpelledDigit = (str: string): number | null => {
    const index = SPELLED_DIGITS.indexOf(str)

    if (index !== -1) {
        return index + 1;
    }

    return null;
}

export const solvePart2 = (input: string): number => {
    let total = 0;
    const lines = input.trim().split('\n');

    for (const line of lines) {
        // set up 2 pointers

        let left = 0;
        let right = line.length - 1;

        let firstDigit: number | null = null;
        let lastDigit: number | null = null;

        // approach from both sides of the line until both digits are found (or out of bounds)

        while ((firstDigit === null || lastDigit === null) && (left < line.length && right >= 0)) {
            if (firstDigit === null) {
                firstDigit = parseDigit(line[left])
                    ?? parseSpelledDigit(line.substring(left, left + 3))
                    ?? parseSpelledDigit(line.substring(left, left + 4))
                    ?? parseSpelledDigit(line.substring(left, left + 5))

                left++;
            }

            if (lastDigit === null) {
                lastDigit = parseDigit(line[right])
                    ?? parseSpelledDigit(line.substring(right - 2, right + 1))
                    ?? parseSpelledDigit(line.substring(right - 3, right + 1))
                    ?? parseSpelledDigit(line.substring(right - 4, right + 1));

                right--;
            }
        }

        // handle unexpected case when either of digits not found

        if (firstDigit === null || lastDigit === null) {
            throw new Error(`Can not find both digits in line: ${line}`);
        }

        // add to the total

        total += firstDigit * 10 + lastDigit;
    }

    return total;
};
