import { getRandomInt } from "@drk4/utilities";
import { getCanvasDimensions } from "./main.js";
import IndividualCard from "./individual_card.js";

/**
 * Will manage all the cards.
 */
export type Suit = "clubs" | "diamonds" | "spades" | "hearts";

export const ALL_SUITS: Suit[] = ["clubs", "diamonds", "hearts", "spades"];

export type SuitSymbol =
    | "two"
    | "three"
    | "four"
    | "five"
    | "six"
    | "seven"
    | "eight"
    | "nine"
    | "ten"
    | "jack"
    | "queen"
    | "king"
    | "ace";

const ALL_SYMBOLS: SuitSymbol[] = [
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "jack",
    "queen",
    "king",
    "ace",
];

// the value represents the order of the symbols (ie three is bigger than two, queen is bigger than jack)
const SYMBOLS_DICT: { [key in SuitSymbol]: number } = {
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
    jack: 11,
    queen: 12,
    king: 13,
    ace: 14,
};

var ALL: IndividualCard[] = [];
var ALL_AVAILABLE: IndividualCard[] = [];

export function init() {
    for (let a = 0; a < ALL_SUITS.length; a++) {
        const suit = ALL_SUITS[a];

        for (let b = 0; b < ALL_SYMBOLS.length; b++) {
            const suitSymbol = ALL_SYMBOLS[b];
            const card = new IndividualCard({
                suit,
                suitSymbol,
            });

            ALL.push(card);
            ALL_AVAILABLE.push(card);
        }
    }

    centerCards();
}

/**
 * Sort the cards based on the symbol value (4 > 3, queen > jack, ace > king, etc).
 */
export function sortCardsBySymbol(cards: IndividualCard[]) {
    return cards.sort((a, b) => a.symbolValue - b.symbolValue);
}

export function getValueOf(symbol: SuitSymbol) {
    return SYMBOLS_DICT[symbol];
}

/*
    Gets a random card that isn't being used at the moment
 */
export function getRandom() {
    var position = getRandomInt(0, ALL_AVAILABLE.length - 1);
    var card = ALL_AVAILABLE.splice(position, 1)[0];

    return card;
}

/*
    Flags a card as not being used
 */
export function setAvailable(card: IndividualCard) {
    ALL_AVAILABLE.push(card);
}

/*
    Tells if a card is currently moving or not
 */
export function isMoving() {
    for (var a = 0; a < ALL.length; a++) {
        if (ALL[a].moveAnimation.isMoving) {
            return true;
        }
    }

    return false;
}

/*
    If there's a card moving, force it to the destination (without the animation)
 */
export function forceMoveToDestination() {
    for (var a = 0; a < ALL.length; a++) {
        ALL[a].moveAnimation.end();
    }
}

export function centerCards() {
    const dimensions = getCanvasDimensions();
    const x = dimensions.width / 2 - IndividualCard.width / 2;
    const y = dimensions.height / 2 - IndividualCard.height / 2;

    for (var a = 0; a < ALL.length; a++) {
        ALL[a].setPosition(x, y);
    }
}

export function get(suit: Suit, symbol: SuitSymbol) {
    for (var a = 0; a < ALL.length; a++) {
        var card = ALL[a];

        if (card.suit == suit && card.suitSymbol == symbol) {
            return card;
        }
    }

    return null;
}
