const ROW_TO_CHECK_Y = 2000000;

const SENSOR_LINE_REGEXP = /Sensor at x=(?<sensorX>-?\d+), y=(?<sensorY>-?\d+): closest beacon is at x=(?<beaconX>-?\d+), y=(?<beaconY>-?\d+)/;

/**
 * Calculates manhattan distance between (x0, y0) and (x1, y1)
 */
const manhattanDistance = (x0: number, y0: number, x1: number, y1: number): number => {
    return Math.abs(x0 - x1) + Math.abs(y0 - y1);
};

/**
 * Details of each sensor and its beacon
 */
interface SensorDetails {
    sensorX: number;
    sensorY: number;
    beaconX: number;
    beaconY: number;
    distanceToBeacon: number;
}

/**
 * Parses input to an array of SensorDetails
 */
const parseInput = (input: string): SensorDetails[] => {
    const sensors: SensorDetails[] = [];

    input.split('\n').forEach((line) => {
        const matches = SENSOR_LINE_REGEXP.exec(line);

        if (!matches || !matches.groups) {
            throw new Error(`Can not parse sensor line: ${line}`);
        }

        const sensorX = Number(matches.groups.sensorX);
        const sensorY = Number(matches.groups.sensorY);
        const beaconX = Number(matches.groups.beaconX);
        const beaconY = Number(matches.groups.beaconY);

        const distanceToBeacon = manhattanDistance(sensorX, sensorY, beaconX, beaconY);

        sensors.push({ sensorX, sensorY, beaconX, beaconY, distanceToBeacon });
    });

    return sensors;
};

const solvePart1 = (input: string): number => {
    const sensors = parseInput(input);

    /**
     * A Set of X unavailable coordinates at ROW_TO_CHECK_Y (the ROW_TO_CHECK_Y is fixed, so we don't store it).
     * We need to remember already found unavailable locations to avoid duplicates
     */
    let unavailableLocations = new Set<number>();

    // check if each sensor's unavailable area cross ROW_TO_CHECK_Y

    sensors.forEach(({ sensorX, sensorY, beaconX, beaconY, distanceToBeacon }) => {
        /**
         * starting from (sensorX, ROW_TO_CHECK_Y) we're going left and right simultaneously, 1 point at a time
         * until distance <= sensorToBeacon distance
         */

        let dx = 0;
        let distance = manhattanDistance(sensorX, sensorY, sensorX, ROW_TO_CHECK_Y);

        while (distance <= distanceToBeacon) {
            if (beaconY !== ROW_TO_CHECK_Y || sensorX - dx !== beaconX) { // make sure to skip the actual beacon's location
                unavailableLocations.add(sensorX - dx);
            }

            if (beaconY !== ROW_TO_CHECK_Y || sensorX + dx !== beaconX) {
                unavailableLocations.add(sensorX + dx);
            }

            dx++;
            distance += 1;
        }
    });

    return unavailableLocations.size;
};

const solvePart2 = (input: string): number => {
    const sensors = parseInput(input);

    /**
     * Checks if new beacon can be placed at (x, y)
     */
    const canBePlaced = (x: number, y: number): boolean => {
        return sensors.every(({ sensorX, sensorY, distanceToBeacon }) => {
            return distanceToBeacon < manhattanDistance(sensorX, sensorY, x, y);
        });
    };

    /**
     * It's trivial that if a single available location exists, it must be located on the border of
     * existing sensors unavailable areas. Therefore, we don't need to check all possible locations (4000000 * 4000000),
     * but we can rather just walk over each of the sensors.
     */

    for (let i = 0; i < sensors.length; i++) {
        const { sensorX, sensorY, beaconX, beaconY, distanceToBeacon } = sensors[i];

        // walk over the sensor unavailable area clockwise from top-most + 1 point

        let y0 = sensorY - distanceToBeacon - 1;
        let x0 = sensorX;

        let y = y0;
        let x = x0;

        let dy = 1;
        let dx = 1;

        do {
            if (x === sensorX + distanceToBeacon + 1) {
                dx = -dx;
            } else if (x === sensorX - distanceToBeacon - 1) {
                dx = 1;
            }

            if (y === sensorY - distanceToBeacon - 1) {
                dy = 1;
            } else if (y === sensorY + distanceToBeacon + 1) {
                dy = -1;
            }

            // if coordinates are within boundaries and the new beacon can be placed -> a single locaiton found
            if (x >= 0 && x <= 4000000 && y >= 0 && y <= 4000000 && canBePlaced(x, y)) {
                return x * 4000000 + y; // return the "tuning frequency"
            }

            x += dx;
            y += dy;
        } while (y !== y0 || x !== x0);
    }

    throw new Error(`Can not find a place suitable for a beacon`);
};

export { solvePart1, solvePart2 };