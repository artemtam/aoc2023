// Enum values are scores given for a corresponding gesture / result

enum Gesture {
    ROCK = 1,
    PAPER = 2,
    SCISSORS = 3
}

enum Result {
    LOSE = 0,
    DRAW = 3,
    WIN = 6
}

// [ElfGesture][MyGesture] => Result

const RoundGestureMap = {
    [Gesture.ROCK]: {
        [Gesture.ROCK]: Result.DRAW,
        [Gesture.PAPER]: Result.WIN,
        [Gesture.SCISSORS]: Result.LOSE,
    },
    [Gesture.PAPER]: {
        [Gesture.ROCK]: Result.LOSE,
        [Gesture.PAPER]: Result.DRAW,
        [Gesture.SCISSORS]: Result.WIN,
    },
    [Gesture.SCISSORS]: {
        [Gesture.ROCK]: Result.WIN,
        [Gesture.PAPER]: Result.LOSE,
        [Gesture.SCISSORS]: Result.DRAW,
    }
};

// [ElfGesture][ExpectedMyResult] => MyGesture

const RoundResultMap = {
    [Gesture.ROCK]: {
        [Result.DRAW]: Gesture.ROCK,
        [Result.WIN]: Gesture.PAPER,
        [Result.LOSE]: Gesture.SCISSORS,
    },
    [Gesture.PAPER]: {
        [Result.LOSE]: Gesture.ROCK,
        [Result.DRAW]: Gesture.PAPER,
        [Result.WIN]: Gesture.SCISSORS,
    },
    [Gesture.SCISSORS]: {
        [Result.WIN]: Gesture.ROCK,
        [Result.LOSE]: Gesture.PAPER,
        [Result.DRAW]: Gesture.SCISSORS,
    }
};

// Map input values to enums

const myGestureMap = { X: Gesture.ROCK, Y: Gesture.PAPER, Z: Gesture.SCISSORS };
const elfGestureMap = { A: Gesture.ROCK, B: Gesture.PAPER, C: Gesture.SCISSORS };
const myResultMap = { X: Result.LOSE, Y: Result.DRAW, Z: Result.WIN };

const solvePart1 = (input: string): number => {
    const games = input.split('\n');

    return games.reduce((score, game) => {
        const [elf, my] = game.split(' ');

        const myGesture = myGestureMap[my as keyof typeof myGestureMap];
        const elfGesture = elfGestureMap[elf as keyof typeof elfGestureMap];

        const myResult = RoundGestureMap[elfGesture][myGesture];

        return score + myResult + myGesture;
    }, 0);
};

const solvePart2 = (input: string): number => {
    const games = input.split('\n');

    return games.reduce((score, game) => {
        const [elf, my] = game.split(' ');

        const myResult = myResultMap[my as keyof typeof myResultMap];
        const elfGesture = elfGestureMap[elf as keyof typeof elfGestureMap];

        const myGesture = RoundResultMap[elfGesture][myResult];

        return score + myResult + myGesture;
    }, 0);
};

export { solvePart1, solvePart2 };

