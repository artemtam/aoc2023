export const solvePart1 = (input: string): number => {
    const [seeds, ...maps] = input.trim().split('\n\n');

    // store sources, we're going to update them in-place on each map

    const sources = seeds.split(': ')[1].split(' ').map(Number);

    for (const map of maps) {
        const [_, ...items] = map.split('\n');

        for (let i = 0; i < sources.length; i++) {
            for (const item of items) {
                const [dRangeStart, sRangeStart, rangeLength] = item.split(' ').map(Number);

                // if source in range, update with a new value & continue with other

                if (sources[i] >= sRangeStart && sources[i] < sRangeStart + rangeLength) {
                    sources[i] = sources[i] - sRangeStart + dRangeStart;
                    break;
                }
            }
        }
    }

    return Math.min(...sources);
};

export const solvePart2 = (input: string): number => {
    const [seeds, ...maps] = input.trim().split('\n\n');
    const sources = seeds.split(': ')[1].split(' ').map(Number);

    // store ranges [start, end] instead of single values as in part 1

    let sourceRanges: [number, number][] = [];

    for (let i = 0; i < sources.length; i += 2) {
        sourceRanges.push([sources[i], sources[i] + sources[i + 1]]);
    }

    for (const map of maps) {
        const [_, ...items] = map.split('\n');

        for (let i = 0; i < sourceRanges.length; i++) {
            for (const item of items) {
                const [dRangeStart, sRangeStart, rangeLength] = item.split(' ').map(Number);

                const delta = dRangeStart - sRangeStart;

                const sRangeEnd = sRangeStart + rangeLength;
                const dRangeEnd = dRangeStart + rangeLength;

                const [rangeStart, rangeEnd] = sourceRanges[i];

                // check all possible ranges intersection
                // -> update sourceRanges with new ranges considering intersections

                // 1. no intersection

                if (rangeEnd < sRangeStart || rangeStart > sRangeEnd) {
                    continue;
                }

                //  2. s inside d

                if (rangeStart >= sRangeStart && rangeEnd <= sRangeEnd) {
                    sourceRanges[i] = [rangeStart + delta, rangeEnd + delta];
                    break;
                }

                //  3. s intersects with d from the left -> split into 2 parts (intersecting and not)

                if (rangeStart < sRangeStart && rangeEnd >= sRangeStart && rangeEnd <= sRangeEnd) {
                    sourceRanges.splice(i++, 1,
                        [dRangeStart, rangeEnd + delta],
                        [rangeStart, sRangeStart - 1],
                    );
                }

                //  4. s intersects with d from the right -> split into 2 parts (intersecting and not)

                if (rangeEnd > sRangeEnd && rangeStart >= sRangeStart && rangeStart <= sRangeEnd) {
                    sourceRanges.splice(i++, 1,
                        [rangeStart + delta, dRangeEnd],
                        [sRangeEnd + 1, rangeEnd],
                    );
                }

                //  4. d inside s -> split into 3 parts (intersecting and not)

                if (rangeStart < sRangeStart && rangeEnd > sRangeEnd) {
                    sourceRanges.splice(i++, 1,
                        [dRangeStart, dRangeEnd],
                        [rangeStart, sRangeStart - 1],
                        [sRangeEnd + 1, rangeEnd],
                    );
                }
            }
        }
    }

    // works, because min value is definitely a start value of a range

    return Math.min(...sourceRanges.flat());
};
