/**
 * Calculates hand strength (an arbitrary value 7 - highest, 1 - lowest)
 * @param hand
 * @param withJoker
 */
const getHandStrength = (hand: string, withJoker: boolean): number => {
    // count cards frequencies

    const cardsFreq = new Map<string, number>();

    for (const card of hand) {
        const cardFreq = cardsFreq.get(card);
        cardsFreq.set(card, cardFreq ? cardFreq + 1 : 1);
    }

    // handle withJoker for Part 2

    if (withJoker && cardsFreq.has('J')) {
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

    // calculate strength as highest n of kinds * 10 + second highest
    // it is a little magic, but it works, see examples:
    // AAAAAA - 50, AAAAB - 41, AAABB - 32, AAABC - 31, AABBC - 22, etc.

    return nOfKinds[0] * 10 + (nOfKinds[1] ?? 0);
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
    // parse input & calculate strength of each hand

    const handBids: { hand: string, strength: number, bid: number }[] = input.trim().split('\n')
        .map((handLine) => {
            const hand = handLine.split(' ')[0];
            const bid = Number(handLine.split(' ')[1]);
            const strength = getHandStrength(hand, false);

            return { hand, strength, bid }
        });

    // sort handBids based on hand strength (lower to higher)

    handBids.sort((a, b) => {
        return a.strength - b.strength || compareSameHands(a.hand, b.hand, '23456789TJQKA');
    });

    // count & return total winnings

    return handBids.reduce((winnings, { hand, bid }, index) => {
        return winnings + (index + 1) * bid; // rank = index + 1 (handBids is sorted by strength)
    }, 0);
};

export const solvePart2 = (input: string): number => {
    // parse input & calculate strength of each hand

    const handBids: { hand: string, strength: number, bid: number }[] = input.trim().split('\n')
        .map((handLine) => {
            const hand = handLine.split(' ')[0];
            const bid = Number(handLine.split(' ')[1]);
            const strength = getHandStrength(hand, true);

            return { hand, strength, bid }
        });

    // sort handBids based on hand strength (lower to higher)

    handBids.sort((a, b) => {
        return a.strength - b.strength || compareSameHands(a.hand, b.hand, 'J23456789TQKA');
    });

    // count & return total winnings

    return handBids.reduce((winnings, { hand, bid }, index) => {
        return winnings + (index + 1) * bid; // rank = index + 1 (handBids is sorted by strength)
    }, 0);
};
