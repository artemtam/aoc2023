type Packets = (number | Packets)[];

/**
 * Compares 2 packets, returns `null` if can't determine
*/
const areInRightOrder = (packets1: Packets, packets2: Packets): boolean | null => {
    // iterate over all packets

    for (let i = 0; i < Math.min(packets1.length, packets2.length); i++) {
        const packet1 = packets1[i];
        const packet2 = packets2[i];

        // if a number, compare and return if decisive

        if (typeof packet1 === 'number' && typeof packet2 === 'number') {
            if (packet1 < packet2) {
                return true;
            } else if (packet1 > packet2) {
                return false;
            } else {
                continue;
            }
        }

        // if any of those not a number -> convert to list, then compare lists

        const result = areInRightOrder(
            Array.isArray(packet1) ? packet1 : [packet1] as Packets,
            Array.isArray(packet2) ? packet2 : [packet2] as Packets,
        );

        // if result determined, return

        if (result !== null) {
            return result;
        }
    }

    // if result was not determined by this point, compare lengths

    if (packets1.length < packets2.length) {
        return true;
    } else if (packets1.length > packets2.length) {
        return false;
    } else {
        return null;
    }
}

const solvePart1 = (input: string): number => {
    let rightOrderPairsCount = 0;

    input.split('\n\n').forEach((pairs, index) => {
        const [packets1Str, packets2Str] = pairs.split('\n');

        const packets1: Packets = JSON.parse(packets1Str); // apparently, packets string is a JS array :)
        const packets2: Packets = JSON.parse(packets2Str);

        if (areInRightOrder(packets1, packets2)) {
            rightOrderPairsCount += index + 1;
        }
    });

    return rightOrderPairsCount;
};

const DIVIDER_PACKET_1: Packets = [[2]];
const DIVIDER_PACKET_2: Packets = [[6]];

const solvePart2 = (input: string): number => {
    // in part 2, we don't care about pairs, so we just parse everything in the array

    const pairs: Packets[] = input.split('\n')
        .filter((line) => line.trim() !== '') // filtering out empty lines
        .map((line) => JSON.parse(line));

    // add divider packets

    pairs.push(DIVIDER_PACKET_1, DIVIDER_PACKET_2);

    // sort pairs based on the order using native Array.sort

    pairs.sort((a, b) => areInRightOrder(a, b) ? -1 : 1);

    // find dividers indexes

    let dividerPacket1Index = pairs.findIndex((packets) => packets.toString() === DIVIDER_PACKET_1.toString()) + 1;
    let dividerPacket2Index = pairs.findIndex((packets) => packets.toString() === DIVIDER_PACKET_2.toString()) + 1;

    return dividerPacket1Index * dividerPacket2Index;
};

export { solvePart1, solvePart2 };