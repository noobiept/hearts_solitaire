import { getRandomInt } from "@drk4/utilities";
import { getCanvasDimensions } from "./main.js";
import IndividualCard from "./individual_card.js";

/**
 * Will manage all the cards.
 */
export type Suit = "clubs" | "diamonds" | "spades" | "hearts";

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

var ALL: IndividualCard[] = [];
var ALL_AVAILABLE: IndividualCard[] = [];

export function init() {
    var suitLength = 4;
    var symbolLength = 13;

    for (var a = 0; a < suitLength; a++) {
        for (var b = 0; b < symbolLength; b++) {
            var card = new IndividualCard({
                suit: a,
                suitSymbol: b,
            });

            ALL.push(card);
            ALL_AVAILABLE.push(card);
        }
    }

    centerCards();
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
