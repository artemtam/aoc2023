// RegExp-s to parse

const MONKEY_INDEX_REGEXP = /^Monkey (?<monkeyId>\d+):$/;
const STARTING_ITEMS_REGEXP = /^ +Starting items: (?<itemsStr>[\d, ?]+)$/;
const OPERATION_REGEXP = /^ +Operation: new = (?<operationStr>.*)$/;
const CONDITION_REGEXP = /^ +Test: divisible by (?<divider>\d+)$/;
const IF_TRUE_REGEXP = /^ +If true: throw to monkey (?<monkeyId>\d+)$/;
const IF_FALSE_REGEXP = /^ +If false: throw to monkey (?<monkeyId>\d+)$/;

// Worry level adjustment for each Part

const WORRY_LEVEL_ADJUSTMENT_1 = 1 / 3;
const WORRY_LEVEL_ADJUSTMENT_2 = 1; // very worried during the Part 2


/**
 * Calculates a base divider (a product of all dividers which are all prime).
 * We are going to store item % baseDivider instead of actual item value -> it allows us
 * to avoid dealing with huge numbers to get correct `% divider` operations results
 */
const calculateBaseDivider = (monkeys: Map<number, Monkey>): number => {
    let baseDivider = 1;

    for (const monkey of monkeys.values()) {
        baseDivider *= monkey.inspectionOptions.divider;
    }

    return baseDivider;
}

/**
 * Counts a business level of monkeys (a product of 2 most active monkeys' inspectionCount-s)
 */
const countMonkeyBusinessLevel = (monkeys: Map<number, Monkey>): number => {
    let mostActive1 = 1;
    let mostActive2 = 1;

    for (const [_, monkey] of monkeys) {
        if (mostActive1 <= monkey.inspectionCount) {
            mostActive2 = mostActive1;
            mostActive1 = monkey.inspectionCount;
        } else if (mostActive2 <= monkey.inspectionCount) {
            mostActive2 = monkey.inspectionCount;
        }
    }

    return mostActive1 * mostActive2;
}

/**
 * Monkey
 */

interface MonkeyInspectionOptions {
    operation: string;
    divider: number;
    ifTrueMonkeyId: number;
    ifFalseMonkeyId: number;
}

class Monkey {
    public inspectionCount: number;
    public readonly items: number[];
    public readonly inspectionOptions: MonkeyInspectionOptions;

    constructor(startingItems: number[], inspectionOptions: MonkeyInspectionOptions) {
        this.items = startingItems;
        this.inspectionOptions = inspectionOptions;
        this.inspectionCount = 0;
    }

    catchItem(item: number): void {
        this.items.push(item);
    }

    inspectAndThrow(item: number, baseDivider: number, worryLevelAdjustment: number): [number, number] {
        const { operation, divider, ifTrueMonkeyId, ifFalseMonkeyId } = this.inspectionOptions;

        this.inspectionCount += 1;

        // noinspection JSUnusedLocalSymbols – used in eval
        const old = item;

        // instead of storing actual item values, we store item % baseDivider
        // in this case, we always get correct `% divider` calculations and do not need to store huge numbers

        const newItem = Math.floor(eval(operation) * worryLevelAdjustment) % baseDivider;
        const throwToId = newItem % divider === 0 ? ifTrueMonkeyId : ifFalseMonkeyId;

        return [newItem, throwToId];
    }
}

const parseInput = (input: string): [Map<number, Monkey>, number] => {
    const monkeys = new Map<number, Monkey>();

    input.split('\n\n').forEach((monkeyInput) => {
        const [
            indexLine,
            startingItemsLine,
            operationLine,
            conditionLine,
            ifTrueLine,
            ifFalseLine,
        ] = monkeyInput.split('\n');

        // parse monkey id

        const indexLineMatches = MONKEY_INDEX_REGEXP.exec(indexLine);

        if (!indexLineMatches || !indexLineMatches.groups?.monkeyId) {
            throw new Error(`Can not parse monkey index line: ${indexLine}`);
        }

        const monkeyId = Number(indexLineMatches.groups.monkeyId);

        // parse starting items

        const startingItemsLineMatches = STARTING_ITEMS_REGEXP.exec(startingItemsLine);

        if (!startingItemsLineMatches || !startingItemsLineMatches.groups?.itemsStr) {
            throw new Error(`Can not parse monkey starting items line: ${startingItemsLine}`);
        }

        const startingItems = startingItemsLineMatches.groups.itemsStr.split(', ').map(Number);

        // parse operation

        const operationLineMatches = OPERATION_REGEXP.exec(operationLine);

        if (!operationLineMatches || !operationLineMatches.groups?.operationStr) {
            throw new Error(`Can not parse monkey operation line: ${operationLine}`);
        }

        const operation = operationLineMatches.groups.operationStr;

        // parse divider

        const conditionLineMatches = CONDITION_REGEXP.exec(conditionLine);

        if (!conditionLineMatches || !conditionLineMatches.groups?.divider) {
            throw new Error(`Can not parse monkey condition line: ${conditionLine}`);
        }

        const divider = Number(conditionLineMatches.groups.divider);

        // parse if true

        const ifTrueLineMatches = IF_TRUE_REGEXP.exec(ifTrueLine);

        if (!ifTrueLineMatches || !ifTrueLineMatches.groups?.monkeyId) {
            throw new Error(`Can not parse monkey if true line: ${ifTrueLine}`);
        }

        const ifTrueMonkeyId = Number(ifTrueLineMatches.groups.monkeyId);

        // parse if false

        const ifFalseLineMatches = IF_FALSE_REGEXP.exec(ifFalseLine);

        if (!ifFalseLineMatches || !ifFalseLineMatches.groups?.monkeyId) {
            throw new Error(`Can not parse monkey if false line: ${ifFalseLine}`);
        }

        const ifFalseMonkeyId = Number(ifFalseLineMatches.groups.monkeyId);

        // create a Monkey
        // we don't have baseDivider until we parse all monkeys, so startingItems are actual values,
        // but it does not really matter

        const monkey = new Monkey(startingItems, {
            operation, divider, ifTrueMonkeyId, ifFalseMonkeyId,
        });

        monkeys.set(monkeyId, monkey);
    });

    return [monkeys, calculateBaseDivider(monkeys)];
}

const solvePart1 = (input: string): number => {
    const [monkeys, baseDivider] = parseInput(input);

    for (let i = 0; i < 20; i++) {
        for (const monkey of monkeys.values()) {
            while (monkey.items.length > 0) {
                const item = monkey.items.shift()!;

                const [newItem, throwToId] = monkey.inspectAndThrow(item, baseDivider, WORRY_LEVEL_ADJUSTMENT_1);

                monkeys.get(throwToId)!.catchItem(newItem);
            }
        }
    }

    return countMonkeyBusinessLevel(monkeys);
};

const solvePart2 = (input: string): number => {
    const [monkeys, baseDivider] = parseInput(input);

    for (let i = 0; i < 10000; i++) {
        for (const monkey of monkeys.values()) {
            while (monkey.items.length > 0) {
                const item = monkey.items.shift()!;

                const [newItem, throwToId] = monkey.inspectAndThrow(item, baseDivider, WORRY_LEVEL_ADJUSTMENT_2);

                monkeys.get(throwToId)!.catchItem(newItem);
            }
        }
    }

    return countMonkeyBusinessLevel(monkeys);
};

export { solvePart1, solvePart2 };