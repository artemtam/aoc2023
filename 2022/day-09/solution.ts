// Parsing constants

const LINE_REGEXP = /^(?<direction>[RULD]) (?<distance>\d+)$/;

const DIRECTION_DELTAS: Record<string, { dx: number, dy: number }> = {
    R: { dx: 1, dy: 0 },
    L: { dx: -1, dy: 0},
    U: { dx: 0, dy: 1 },
    D: { dx: 0, dy: -1},
}

// Rope is a linked list of Knot-s

class Knot {
    public x: number;
    public y: number;
    public next: Knot | null;

    constructor(x: number, y: number) {
       this.x = x;
       this.y = y;

       this.next = null
    }

    public follow(knot: Knot) {
        const dHorizontal = knot.x - this.x;
        const dVertical = knot.y - this.y;

        // if distance more than 2, the knot needs to move

        if (Math.abs(dHorizontal) >= 2 || Math.abs(dVertical) >= 2) {
            this.x += Math.sign(dHorizontal);
            this.y += Math.sign(dVertical);

            if (this.next) { // the knot moved, so the next must follow
                this.next.follow(this);
            }
        }
    }
}

// HeadKnot is a Knot that can be pulled

class HeadKnot extends Knot {
    constructor(x: number, y: number) {
        super(x, y);
    }

    public pull(dx: number, dy: number): void {
        this.x += dx;
        this.y += dy;

        if (this.next) {
            this.next.follow(this);
        }
    }
}

const solve = (input: string, ropeLength: number): number => {
    // create a rope

    const ropeHead = new HeadKnot(0, 0);

    let curr: Knot = ropeHead;

    for (let i = 0; i < ropeLength - 1; i++) {
        curr.next = new Knot(0, 0);
        curr = curr.next;
    }

    const tail = curr; // last added Knot is a tail

    // keep track of coordinates, visited by a tail (a set of `x, y` strings)

    const visited = new Set<string>();

    input.split('\n').forEach((line) => {
        // parse a line

        const matches = LINE_REGEXP.exec(line);

        if (!matches || !matches?.groups?.direction || !matches?.groups?.distance) {
            throw new Error(`Can not parse line: ${line}`);
        }

        const direction = matches.groups.direction;
        const distance = Number(matches.groups.distance);

        const { dx, dy } = DIRECTION_DELTAS[direction];

        // pull rope to direction for distance

        for (let i = 0; i < distance; i++) {
            ropeHead.pull(dx, dy);

            // after each pull step, record tail visited coordinates,
            // `Set` will filter out duplicates automatically

            visited.add(`${tail.x}, ${tail.y}`)
        }
    });

   return visited.size;
};

const solvePart1 = (input: string): number => {
    return solve(input, 2);
};

const solvePart2 = (input: string): number => {
    return solve(input, 10);
};

export { solvePart1, solvePart2 };