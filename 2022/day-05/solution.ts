const solve = (input: string, crane: 'CrateMover 9000' | 'CrateMover 9001'): string => {
    const [stacks, commands] = input.split('\n\n');

    // -- parse initial crates layout --

    const rows = stacks.split('\n');

    const stacksMap = new Map<string, string[]>(); // stackId -> crates

    // 1. add stacks to stacksMap

    const stackIds = rows[rows.length - 1].trim().split('   '); // exactly 3 spaces between IDs

    for (const stackId of stackIds) {
        stacksMap.set(stackId, []);
    }

    // 2. fill stacks with crates

    for (let i = 0; i < rows.length - 1; i++) {
        for (const { 1: crate, index } of rows[i].matchAll(/\[(.)]/g)) {
            if (index !== undefined) {
                const stackId = (Math.floor(index / 4) + 1).toString();
                const stack = stacksMap.get(stackId);

                if (stack === undefined) {
                    throw new Error(`Can't locate stack by id: ${stackId}`);
                }

                stack.unshift(crate);
            }
        }
    }

    // -- parse and execute commands --

    commands.split('\n').forEach((command) => {
        // 1. parse a command

        const matches = /move (?<count>\d*) from (?<fromStackId>\d*) to (?<toStackId>\d*)/g.exec(command);

        if (matches === null || matches.groups === undefined) {
            throw new Error(`Can't parse command: ${command}`);
        }

        const cratesCount = Number(matches.groups.count);
        const { fromStackId, toStackId } = matches.groups;

        // 2. get source and target stacks

        const fromStack = stacksMap.get(fromStackId);

        if (!fromStack) {
            throw new Error(`Can't locate stack by id: ${fromStackId}`);
        }

        const toStack = stacksMap.get(toStackId);

        if (!toStack) {
            throw new Error(`Can't locate stack by id: ${toStackId}`);
        }

        // 3. move crates

        if (crane === 'CrateMover 9000') {
            for (let i = 0; i < cratesCount; i++) {
                const crate = fromStack.pop();

                if (!crate) {
                    throw new Error(`Not enough crates in the stack ${fromStackId}. Expected ${cratesCount}, found ${i + 1}`);
                }

                toStack.push(crate);
            }
        } else if (crane === 'CrateMover 9001') {
            const cratesToMove = []; // CrateMover 9001 picks up all crates first

            for (let i = 0; i < cratesCount; i++) {
                const crate = fromStack.pop();

                if (!crate) {
                    throw new Error(`Not enough crates in the stack ${fromStackId}. Expected ${cratesCount}, found ${i + 1}`);
                }

                cratesToMove.unshift(crate);
            }

            toStack.push(...cratesToMove);
        } else {
            throw new Error(`Unsupported crane: ${crane}`);
        }
    });

    // -- collect crates on top of each stack --

    let topCrates = '';

    for (const stack of stacksMap.values()) {
        topCrates += stack.pop();
    }

    return topCrates;
};

const solvePart1 = (input: string): string => {
    return solve(input, 'CrateMover 9000');
};

const solvePart2 = (input: string): string => {
    return solve(input, 'CrateMover 9001');
};

export { solvePart1, solvePart2 };