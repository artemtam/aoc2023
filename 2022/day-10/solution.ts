// Parse commands RegExp-s

const NOOP_CMD_REGEXP = /^noop$/;
const ADDX_CMD_REGEXP = /^addx (?<value>-?\d+)$/

// Command interfaces

enum CMD {
    NOOP,
    ADDX
}

interface CommandBase {
    name: CMD;
}

interface NoopCmd extends CommandBase {
    name: CMD.NOOP;
}

interface AddxCmd extends CommandBase {
    name: CMD.ADDX;
    value: number;
}

type Command = NoopCmd | AddxCmd;

// CRT

class CRT {
    public readonly width: number;
    public readonly height: number;

    private readonly buffer: string[][];

    private cursor: number;

    constructor(width: number = 40, height: number = 6) {
        this.width = width;
        this.height = height;

        this.buffer = [];

        for (let i = 0; i < this.height; i++) {
            this.buffer.push([]);
        }

        this.cursor = 0;
    }

    public drawPixel(spriteStart: number, spriteEnd: number): void {
        const row = Math.floor(this.cursor / this.width);
        const col = this.cursor % this.width;

        if (col >= spriteStart && col <= spriteEnd) {
            this.buffer[row][col] = '#';
        } else {
            this.buffer[row][col] = '.';
        }

        this.cursor += 1;
    }

    public toString(): string {
        return this.buffer.map((row) => {
            return row.join('');
        }).join('\n');
    }
}

const solve = (input: string): [number, string] => {
    const execQueue: Command[] = [];

    // parse input to execQueue

    input.split('\n').forEach((line) => {
        if (NOOP_CMD_REGEXP.test(line)) {
            execQueue.push({ name:  CMD.NOOP });
        } else if (ADDX_CMD_REGEXP.test(line)) {
            const matches = ADDX_CMD_REGEXP.exec(line);

            if (!matches || !matches?.groups?.value) {
                throw new Error(`Can not parse addx command: ${line}`);
            }

            execQueue.push({ name:  CMD.ADDX, value: Number(matches.groups.value)  });
        } else {
            throw new Error(`Unrecognized command: ${line}`);
        }
    });

    // set up for execution

    let cycle = 1;
    let registerX = 1;
    let signalStrength = 0;

    const crt = new CRT();
    const execImmediate: Command[] = [];

    // execute execQueue

    while (execQueue.length !== 0) {
        // if cycle of interest -> add signal strength

        if ([20, 60, 100, 140, 180, 220].includes(cycle)) {
            signalStrength += cycle * registerX;
        }

        crt.drawPixel(registerX - 1, registerX + 1);

        // check execImmediate stack and execute

        const immediateCmd = execImmediate.pop();

        if (immediateCmd !== undefined) {
            switch (immediateCmd.name) {
                case CMD.ADDX:
                    registerX += immediateCmd.value;
                    break
                default:
                    throw new Error(`Unrecognized immediate command: ${immediateCmd}`);
            }
        } else {
            const queueCmd = execQueue.shift()!;

            switch (queueCmd.name) {
                case CMD.NOOP: // do nothing
                    break;
                case CMD.ADDX: // push to execImmediate stack to be executed during the next cycle
                    execImmediate.push(queueCmd);
            }
        }

        cycle += 1;
    }

    return [signalStrength, crt.toString()];
};

const solvePart1 = (input: string): number => {
    const [signalStrength] = solve(input);
    return signalStrength;
};


const solvePart2 = (input: string): string => {
    const [_, crtPicture] = solve(input);
    return crtPicture;
};

export { solvePart1, solvePart2 };