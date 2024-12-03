const INSTRUCTIONS_REGEXP = new RegExp(/mul\((?<a>\d*),(?<b>\d*)\)/gm);

export const solvePart1 = (input: string): number => {
    const matches = input.matchAll(INSTRUCTIONS_REGEXP);

    let result = 0;

    for (const match of matches) {
        result += Number(match.groups!.a) * Number(match.groups!.b);
    }

    return result;
};

// For Part 2, the regexp will also capture conditions (do() and dont())
// this will let us iterate over the matches and keep track of the latest condition
// to determine if we should multiply the numbers or not.
//
// NB: group names are used to later identify which instruction/condition was matched

const INSTRUCTIONS_WITH_CONDITIONS = new RegExp(/(?<do>do\(\))|(?<dont>don't\(\))|(?<mul>mul\((?<a>\d*),(?<b>\d*)\))/gm);

export const solvePart2 = (input: string): number => {
    const matches = input.matchAll(INSTRUCTIONS_WITH_CONDITIONS);

    let result = 0;
    let shouldDo = true;

    for (const match of matches) {
        if (shouldDo && match.groups?.mul !== undefined) {
            result += Number(match.groups.a) * Number(match.groups.b);
        } else if (match.groups?.do !== undefined) {
            shouldDo = true;
        } else if (match.groups?.dont !== undefined) {
            shouldDo = false;
        }
    }

    return result;
};
