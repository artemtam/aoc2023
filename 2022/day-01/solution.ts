const solve = (input: string): [number, number] => {
    let maxCalories1 = 0; // calories >= 0
    let maxCalories2 = 0;
    let maxCalories3 = 0;

    const elvesCalories = input.split('\n\n'); // \n\n = empty line between elves

    elvesCalories.forEach((elfCalories) => {
        const elfCaloriesParsed = elfCalories.split('\n');

        // count the sum of the elf's calories
        const elfCaloriesSum = elfCaloriesParsed.reduce((sum, elfCalorie) => {
            return sum + Number(elfCalorie);
        }, 0);

        if (elfCaloriesSum >= maxCalories1) {
            maxCalories3 = maxCalories2;
            maxCalories2 = maxCalories1;
            maxCalories1 = elfCaloriesSum;
        } else if (elfCaloriesSum >= maxCalories2) {
            maxCalories3 = maxCalories2;
            maxCalories2 = elfCaloriesSum;
        } else if (elfCaloriesSum >= maxCalories3) {
            maxCalories3 = elfCaloriesSum;
        }
    });

    return [maxCalories1, maxCalories1 + maxCalories2 + maxCalories3];
}

const solvePart1 = (input: string): number => {
    const [maxCalories] = solve(input)
    return maxCalories;
};

const solvePart2 = (input: string): number => {
    const [_, maxCaloriesTop3] = solve(input)
    return maxCaloriesTop3;
};

export { solvePart1, solvePart2 };


