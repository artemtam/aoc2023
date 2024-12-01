export const solvePart1 = (input: string): number => {
    let totalPoints = 0;

    const cards = input.trim().split('\n');

    for (const card of cards) {
        const numbers = card.split(': ')[1]; // numbers are after `{Card N]: `

        const [numbersWinning, numbersActual] = numbers.split(' | ')
            .map((numbers) => numbers.split(' ').filter(Boolean));

        // count wins

        let wins = 0;

        for (const number of numbersActual) {
            if (numbersWinning.includes(number)) { // might use set for faster lookup
                wins += 1;
            }
        }

        // add to totalPoints

        totalPoints += wins !== 0 ? 2 ** (wins - 1) : 0;
    }

    return totalPoints;
};

export const solvePart2 = (input: string): number => {
    let cardWins = new Map<number, number>(); // cardId => n wins
    let cardsCopies = new Map<number, number>(); // cardId => n copies

    // parse cards and fill in cardWins & cardCopies (all 1s)

    const cards = input.trim().split('\n');

    for (let i = 0; i < cards.length; i++) {
        const [cardTitle, numbers] = cards[i].split(': '); // numbers are after `{Card N]: `

        const cardId = Number(cardTitle.split(' ').filter(Boolean)[1]);

        const [numbersWinning, numbersActual] = numbers.split(' | ')
            .map((numbers) => numbers.split(' ').filter(Boolean));

        // count wins

        let wins = 0;

        for (const number of numbersActual) {
            if (numbersWinning.includes(number)) { // might use set for faster lookup
                wins += 1;
            }
        }

        // fill in maps

        cardWins.set(cardId, wins);
        cardsCopies.set(cardId, 1);
    }

    // iterate over all cards, count copies

    for (const [cardId, wins] of cardWins.entries()) {
        const currentCardCopies = cardsCopies.get(cardId)!;

        for (let j = cardId + 1; j < cardId + wins + 1; j++) {
            cardsCopies.set(j, cardsCopies.get(j)! + currentCardCopies);
        }
    }

    // count total copies

    let total = 0;

    for (const countCopies of cardsCopies.values()) {
        total += countCopies;
    }

    return total;
};
