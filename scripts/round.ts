import * as Message from "./message";
import { setAvailable } from "./cards";
import { cardPlayed, Position, CARD_SPEED } from "./game";
import { getCanvasDimensions, CanvasDimensions } from "./canvas";
import IndividualCard from "./individual_card";

export type RoundPoints = {
    [key in Position]: number;
};

type RoundCards = {
    [key in Position]: IndividualCard[];
};

var IS_FIRST_TURN: boolean;
var IS_HEARTS_BROKEN: boolean;

// cards played in the current turn
var CARDS: IndividualCard[] = [];

// lead card in the current turn
var LEAD_CARD: IndividualCard | undefined;

const POINTS_CARDS: RoundCards = {
    south: [],
    west: [],
    north: [],
    east: [],
};

var CURRENT_TURN = 1;

// force the move animation of cards for a turn
var NO_MOVE_ANIMATION = false;

export function isValidMove(card: IndividualCard) {
    var player = card.player;

    // first play of the turn
    if (!LEAD_CARD) {
        // need to play the 2 of clubs
        if (IS_FIRST_TURN) {
            if (card.suit == "clubs" && card.suitSymbol == "two") {
                return true;
            } else {
                Message.open(
                    "Invalid move.",
                    "The first turn has to start with the 2 of clubs."
                );
                return false;
            }
        }

        // the hearts can only be played if its already broken (or if you only have hearts left)
        // otherwise any card can be played
        else {
            if (card.suit === "hearts") {
                if (!IS_HEARTS_BROKEN) {
                    // check if you only have hearts left
                    if (player.cards.hearts.length == player.getCardsCount()) {
                        return true;
                    } else {
                        Message.open(
                            "Invalid move.",
                            "Hearts haven't been broken yet."
                        );
                        return false;
                    }
                }
            }

            return true;
        }
    } else {
        var leadSuit = LEAD_CARD.suit;

        if (card.suit == leadSuit) {
            return true;
        }

        // you can only play a different suit if you don't have cards of the lead suit
        else {
            if (player.cards[leadSuit].length == 0) {
                // can't play the queen of spades or hearts on the first turn (unless you happen to have all 13 hearts cards)
                // or 12 hearts cards + the queen of spades
                if (IS_FIRST_TURN) {
                    if (
                        card.suit == "spades" &&
                        card.suitSymbol == "queen" &&
                        player.cards["hearts"].length < 12
                    ) {
                        Message.open(
                            "Invalid move.",
                            "Can't play the queen of spades on first turn."
                        );
                        return false;
                    } else if (
                        card.suit == "hearts" &&
                        player.cards["hearts"].length < 13
                    ) {
                        Message.open(
                            "Invalid move.",
                            "Can't play hearts on the first turn (unless you happen to have all 13 hearts cards)."
                        );
                        return false;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            } else {
                Message.open(
                    "Invalid move.",
                    "Need to play a card of the " + leadSuit + " suit."
                );
                return false;
            }
        }
    }
}

/**
 * Returns true if the card was played, or false if its an invalid play.
 */
export function playCard(card: IndividualCard) {
    const dimensions = getCanvasDimensions();
    let x = dimensions.width / 2 - IndividualCard.width / 2;
    let y = dimensions.height / 2 - IndividualCard.height / 2;

    const offset = 70;

    switch (card.player.position) {
        case "west":
            x -= offset;
            break;

        case "east":
            x += offset;
            break;

        case "north":
            y -= offset;
            break;

        case "south":
            y += offset;
            break;

        default:
            throw new Error("error, wrong orientation argument.");
    }

    var animationDuration = CARD_SPEED.play;

    if (NO_MOVE_ANIMATION) {
        animationDuration = 0;
    }

    card.changeSide(true);
    card.show(); // force the card to be shown in front of others
    card.moveTo(x, y, animationDuration, function() {
        cardPlayed();
    });

    CARDS.push(card);

    if (!LEAD_CARD) {
        LEAD_CARD = card;
    }

    if (card.suit === "hearts") {
        IS_HEARTS_BROKEN = true;
    }
}

/**
 * Returns null if the round hasn't ended, otherwise returns a reference to the player that won
 */
export function getTurnWinner() {
    // all players played a card, need to determine who won the round
    if (CARDS.length >= 4) {
        // a round was completed, so we can update this flag
        if (IS_FIRST_TURN) {
            IS_FIRST_TURN = false;
        }

        const winner = determineWinner();

        CARDS.forEach((card) => {
            const { x, y } = winner.getCardCenterPosition();
            card.moveAndHide(x, y, CARD_SPEED.back);
        });

        CURRENT_TURN++;
        clearTurn();
        hideAllCards();

        return winner;
    }

    return null;
}

export function cardsPlayed() {
    return CARDS;
}

function determineWinner() {
    // get all cards of the suit of the lead
    const suit = LEAD_CARD!.suit;
    const cards = CARDS.filter((card) => card.suit === suit);

    // determine the card with highest symbol (will be the winner)
    const highest = cards.reduce((high, current) =>
        current.symbolValue > high.symbolValue ? current : high
    );

    // find the cards that matter (add to the points)
    const pointsCards = CARDS.filter(
        (card) =>
            card.suit === "hearts" ||
            (card.suit === "spades" && card.suitSymbol === "queen")
    );

    const player = highest.player;
    POINTS_CARDS[player.position] = POINTS_CARDS[player.position].concat(
        pointsCards
    );

    return highest.player;
}

function calculatePoints(cards: IndividualCard[]) {
    return cards.reduce((total, card) => {
        if (card.suit === "hearts") {
            return total + 1;
        }

        if (card.suit === "spades" && card.suitSymbol === "queen") {
            return total + 13;
        }

        return total;
    }, 0);
}

/**
 * Called when the round ends.
 * Need to check if a player got all the hearts + queen of spades (if so, all the other players get 26 points).
 * Otherwise just calculate the points normally:
 *      - Queen of spades 13 points
 *      - Each heart card 1 point
 */
export function getPoints() {
    if (POINTS_CARDS.west.length >= 14) {
        return {
            west: 0,
            north: 26,
            east: 26,
            south: 26,
        };
    }

    if (POINTS_CARDS.north.length >= 14) {
        return {
            west: 26,
            north: 0,
            east: 26,
            south: 26,
        };
    }

    if (POINTS_CARDS.east.length >= 14) {
        return {
            west: 26,
            north: 26,
            east: 0,
            south: 26,
        };
    }

    if (POINTS_CARDS.south.length >= 14) {
        return {
            west: 26,
            north: 26,
            east: 26,
            south: 0,
        };
    }

    // else, calculate points for each player
    return {
        west: calculatePoints(POINTS_CARDS["west"]),
        north: calculatePoints(POINTS_CARDS["north"]),
        east: calculatePoints(POINTS_CARDS["east"]),
        south: calculatePoints(POINTS_CARDS["south"]),
    };
}

/**
 * When a round ends, removes the cards and the lead card.
 */
function clearTurn() {
    CARDS.forEach((card) => setAvailable(card));
    CARDS.length = 0;

    NO_MOVE_ANIMATION = false;
    LEAD_CARD = undefined;
}

/**
 * Hide all the cards (show the back of the card).
 */
function hideAllCards() {
    CARDS.forEach((card) => card.changeSide(false));
}

/**
 * For when restarting the game (clears everything).
 */
export function clearRound() {
    clearTurn();

    POINTS_CARDS.south.length = 0;
    POINTS_CARDS.west.length = 0;
    POINTS_CARDS.north.length = 0;
    POINTS_CARDS.east.length = 0;
    CURRENT_TURN = 1;

    IS_FIRST_TURN = true;
    IS_HEARTS_BROKEN = false;
}

export function isHeartsBroken() {
    return IS_HEARTS_BROKEN;
}

export function isFirstTurn() {
    return IS_FIRST_TURN;
}

export function getLeadCard() {
    return LEAD_CARD;
}

export function getCurrentTurn() {
    return CURRENT_TURN;
}

export function getPointsCards() {
    return POINTS_CARDS;
}

export function noMoveAnimationThisTurn() {
    NO_MOVE_ANIMATION = true;
}

export function resize(canvas: CanvasDimensions) {
    var centerX = canvas.width / 2 - IndividualCard.width / 2;
    var centerY = canvas.height / 2 - IndividualCard.height / 2;
    var offset = 70;

    for (var a = 0; a < CARDS.length; a++) {
        var card = CARDS[a];
        var x = centerX;
        var y = centerY;

        switch (card.player.position) {
            case "west":
                x -= offset;
                break;

            case "east":
                x += offset;
                break;

            case "north":
                y -= offset;
                break;

            case "south":
                y += offset;
                break;

            default:
                throw new Error("error, wrong orientation argument.");
        }

        card.setPosition(x, y);
    }
}
