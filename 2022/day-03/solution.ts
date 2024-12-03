// index of each item = the priority (_ to skip 0)
const itemPriorities = '_abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

const solvePart1 = (input: string): number => {
    const rucksacks = input.split('\n');

    let prioritiesSum = 0;

    for (const rucksack of rucksacks) {
        const itemsInFirstComp = rucksack.slice(0, rucksack.length / 2);

        for (let i = rucksack.length / 2; i < rucksack.length; i++) {
            if (itemsInFirstComp.includes(rucksack[i])) {
                prioritiesSum += itemPriorities.indexOf(rucksack[i]);
                break;
            }
        }
    }

    return prioritiesSum;
};

const solvePart2 = (input: string): number => {
    const rucksacks = input.split('\n');

    let prioritiesSum = 0;

    // iterate over groups of 3

    for (let i = 0; i < rucksacks.length - 2; i += 3) {
        const rucksackA = rucksacks[i];
        const rucksackB = rucksacks[i + 1];
        const rucksackC = rucksacks[i + 2];

        for (const item of rucksackC) {
            if (rucksackA.includes(item) && rucksackB.includes(item)) {
                prioritiesSum += itemPriorities.indexOf(item);
                break;
            }
        }
    }

    return prioritiesSum;
};

export { solvePart1, solvePart2 };