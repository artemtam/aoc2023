export const solvePart1 = (input: string): number => {
    let result = 1;

    const [time, distance] = input.trim().split('\n');

    const times = time.replace('Time:', '').trim().split(' ').filter(Boolean).map(Number);
    const distances = distance.replace('Distance:', '').trim().split(' ').filter(Boolean).map(Number);

    for (let i = 0; i < times.length; i++) {
        const time = times[i];
        const distance = distances[i];

        let wins = 0;

        for (let holdTime = 0; holdTime <= time; holdTime++) {
            let travelDistance = (time - holdTime) * holdTime;

            if (travelDistance > distance) {
                wins++;
            }
        }

        result *= wins;
    }

    return result;
};

export const solvePart2 = (input: string): number => {
    const [timeLine, distanceLine] = input.trim().split('\n');

    const time = Number(timeLine.replaceAll(/Time:| /g, ''));
    const distance = Number(distanceLine.replaceAll(/Distance:| /g, ''));

    /**
     * Brute-force from Part 1 works fine, but here is the optimal solution .
     *
     * Let's take a look at travelDistance(holdTime) function:
     * travelDistance = f(holdTime) = (time - holdTime) * holdTime = -holdTime ^ 2 + time
     *
     * f(holdTime) is an upside-down parabola => `f(holdTime) > distance` is achieved in the interval
     * between the roots of f(holdTime) = distance.
     *
     * We can calculate those roots as for a normal quadratic equation, then all values
     * between them are going to be wins
     */

    const holdTimeA = (time - Math.sqrt(time * time - 4 * distance )) / 2;
    const holdTimeB = (time + Math.sqrt(time * time - 4 * distance )) / 2;

    // return number of values between roots (= wins)

    return Math.floor(holdTimeB - holdTimeA);
};
