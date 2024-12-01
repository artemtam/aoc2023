enum SpringStatus {
    DAMAGED = '#',
    OPERATIONAL = '.',
    UNKNOWN = '?',
}

const cache = new Map();

/**
 * This function counts all valid conditions and basically IS a solution for both parts.
 * It enumerates all possible conditions recursively and count valid ones.
 *
 * Not optimized, it is extremely slow (1 sec for p1, forever for p2).
 * Here are 3 optimizations I've applied to get better times (17ms - p1, 300ms - p2):
 *
 * 1. Return 0 early: it validates non-completed conditions and exits if it finds invalid paths,
 *    so we never even finish conditions if we see they are invalid at the beginning.
 *
 * 2. Cut off validated groups: when >= 1 groups are passed, we don't need to re-check them on every future branch.
 *    Therefore, we cut off the beginning of the conditions string, and remove corresponding groups from conditionGroups.
 *
 * 3. Memoization - together (and only together) with optimization 2, we can apply memoization to not re-calculate
 *    smaller repetitive groups. This has a significant effect.
 */
const countValidConditions = (conditions: string, conditionGroups: number[]): number => {
    let validConditions = 0;

    let groupSize = 0;
    let groupIndex = 0;
    let index = 0;

    for (const status of conditions) {
        if (status === SpringStatus.DAMAGED) {
            groupSize += 1;

            if (groupSize > conditionGroups[groupIndex]) {
                return 0;
            }
        } else if (status === SpringStatus.OPERATIONAL && groupSize !== 0) {
            if (conditionGroups[groupIndex] !== groupSize) {
                return 0;
            }

            groupSize = 0;
            groupIndex += 1;
        } else if (status === SpringStatus.UNKNOWN) {
            break;
        }

        index += 1;
    }

    if (conditions[index] === SpringStatus.UNKNOWN) {
        // here the recursion happens
        // we can replace UNKNOWN with either OPERATIONAL or DAMAGED

        // OPERATIONAL: only makes sense if not in group or groupSize is correct

        if (groupSize === 0 || groupSize === conditionGroups[groupIndex]) {
            // cut all processed groups & continue with a remaining conditions

            const cutConditions = conditions.substring(index + 1);
            const cutGroups = conditionGroups.slice(groupSize !== 0 ? groupIndex + 1 : groupIndex);

            // get key & check cache

            const key = cutConditions + cutGroups.join('\n');

            if (cache.has(key)) {
                validConditions += cache.get(key);
            } else {
                const cutValidConditions = countValidConditions(cutConditions, cutGroups);
                cache.set(key, cutValidConditions);
                validConditions += cutValidConditions;
            }
        }

        // DAMAGED

        validConditions += countValidConditions(
            conditions.substring(0, index) + SpringStatus.DAMAGED + conditions.substring(index + 1),
            conditionGroups,
        );
    } else {
        if (groupSize !== 0 && conditionGroups[groupIndex] !== groupSize) {
            return 0;
        } else if (groupSize !== 0) {
            groupIndex += 1;
        }

        return groupIndex === conditionGroups.length ? 1 : 0;
    }

    return validConditions;
}

export const solvePart1 = (input: string): number => {
    let totalArrangements = 0;

    const records = input.trim().split('\n');

    for (const record of records) {
        const conditions = record.split(' ')[0];
        const conditionsGroups = record.split(' ')[1].split(',').map(Number);

        totalArrangements += countValidConditions(conditions, conditionsGroups);
    }

    return totalArrangements;
}

export const solvePart2 = (input: string): number => {
    let totalArrangements = 0;

    const records = input.trim().split('\n');

    for (const record of records) {
        const conditions = record.split(' ')[0];
        const conditionsGroups = record.split(' ')[1].split(',').map(Number);

        const unfoldedConditions = [conditions, conditions, conditions, conditions, conditions].join(SpringStatus.UNKNOWN);
        const unfoldedConditionsGroups = [...conditionsGroups, ...conditionsGroups, ...conditionsGroups, ...conditionsGroups, ...conditionsGroups];

        totalArrangements += countValidConditions(unfoldedConditions, unfoldedConditionsGroups);
    }

    return totalArrangements;
};
