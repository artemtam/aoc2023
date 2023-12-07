/**
 * Calculates hand strength (an arbitrary value 7 - highest, 1 - lowest)
 * @param hand
 * @param withJocker
 */
const getHandStrength = (hand: string, withJocker: boolean): number => {
    // count cards frequencies

    const cardsFreq = new Map<string, number>();

    for (const card of hand) {
        const cardFreq = cardsFreq.get(card);
        cardsFreq.set(card, cardFreq ? cardFreq + 1 : 1);
    }

    // handle withJocker for Part 2

    if (withJocker && cardsFreq.has('J')) {
        const jFreq = cardsFreq.get('J')!;

        // find non-J card with maximum frequency

        let maxFreq = 0;
        let maxFreqCard = null;

        for (const [card, freq] of cardsFreq.entries()) {
            if (card !== 'J' && freq > maxFreq) {
                maxFreq = freq;
                maxFreqCard = card;
            }
        }

        // if found (all cases except JJJJJJ) -> treat J as this card

        if (maxFreqCard !== null) {
            cardsFreq.set(maxFreqCard, maxFreq + jFreq);
            cardsFreq.delete('J');
        }
    }

    // get number of kinds array sorted desc

    const nOfKinds = Array.from(cardsFreq.values()).sort((a, b) => b - a);

    // calculate strength

    if (nOfKinds[0] === 5) { // 5 of kind
        return 7;
    } else if (nOfKinds[0] === 4) { // 4 of kind
        return 6;
    } else if (nOfKinds[0] === 3 && nOfKinds[1] === 2) { // full house
        return 5;
    } else if (nOfKinds[0] === 3) { // 3 of kind
        return 4;
    } else if (nOfKinds[0] === 2 && nOfKinds[1] === 2) { // 2 pair
        return 3;
    } else if (nOfKinds[0] === 2) { // 1 pair
        return 2;
    } else {
        return 1;
    }
};

/**
 * Compares handA to handB for sorting
 * @param handA
 * @param handB
 * @param cardsStrength cards ordered by strength asc as a string
 */
const compareSameHands = (handA: string, handB: string, cardsStrength: string): number => {
    for (let i = 0; i < handA.length; i++) {
        const value = cardsStrength.indexOf(handA[i]) - cardsStrength.indexOf(handB[i]);

        if (value !== 0) {
            return value;
        }
    }

    return 0;
};


export const solvePart1 = (input: string): number => {
    // parse input

    const handBids: { hand: string, bid: number }[] = input.trim().split('\n')
        .map((handLine) => ({
            hand: handLine.split(' ')[0],
            bid: Number(handLine.split(' ')[1]),
        }));

    // sort handBids based on hand strength (lower to higher)

    handBids.sort((a, b) => {
        return getHandStrength(a.hand, false) - getHandStrength(b.hand, false)
            || compareSameHands(a.hand, b.hand, '23456789TJQKA');
    });

    // count & return total winnings

    return handBids.reduce((winnings, { hand, bid }, index) => {
        return winnings + (index + 1) * bid; // rank = index + 1 (handBids is sorted by strength)
    }, 0);
};

export const solvePart2 = (input: string): number => {
    // parse input

    const handBids: { hand: string, bid: number }[] = input.trim().split('\n')
        .map((handLine) => ({
            hand: handLine.split(' ')[0],
            bid: Number(handLine.split(' ')[1]),
        }));

    // sort handBids based on hand strength (lower to higher)

    handBids.sort((a, b) => {
        return getHandStrength(a.hand, true) - getHandStrength(b.hand, true)
            || compareSameHands(a.hand, b.hand, 'J23456789TQKA');
    });

    // count & return total winnings

    return handBids.reduce((winnings, { hand, bid }, index) => {
        return winnings + (index + 1) * bid; // rank = index + 1 (handBids is sorted by strength)
    }, 0);
};
