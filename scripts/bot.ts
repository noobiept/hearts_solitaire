import Player, { PlayerArgs } from "./player.js";
import * as Round from "./round.js";
import * as Game from "./game.js";
import IndividualCard from "./individual_card.js";
import {
    ALL_SUITS,
    sortCardsBySymbol,
    cardEqualOrHigherThan,
    cardHigherThan,
    Suit,
    cardLowerThan,
} from "./cards.js";

interface BotArgs extends PlayerArgs {}

export default class Bot extends Player {
    constructor(args: BotArgs) {
        args.isBot = true;

        super(args);
    }

    yourTurn() {
        // things i need to know
        var heartsBroken = Round.isHeartsBroken();
        var firstTurn = Round.isFirstTurn();
        var passPhase = Game.isPassCardsPhase();
        var leadCard = Round.getLeadCard();

        if (passPhase) {
            this.passCardPhaseLogic();
        } else {
            // we're starting the round
            if (!leadCard) {
                this.leadCardLogic(firstTurn, heartsBroken);
            } else {
                this.respondCardLogic(firstTurn, leadCard);
            }
        }
    }

    passCardPhaseLogic() {
        // get the 3 highest cards of each suit
        var highestCards = [];

        for (let a = 0; a < ALL_SUITS.length; a++) {
            const suit = ALL_SUITS[a];
            const cards = this.cards[suit];

            const highest = cards[cards.length - 1];
            const secondHighest = cards[cards.length - 2];
            const thirdHighest = cards[cards.length - 3];

            if (highest) {
                highestCards.push(highest);
            }

            if (secondHighest) {
                highestCards.push(secondHighest);
            }

            if (thirdHighest) {
                highestCards.push(thirdHighest);
            }
        }

        // now get the 3 highest of all the suits
        highestCards = sortCardsBySymbol(highestCards);

        Game.addCardPlayQueue(highestCards[highestCards.length - 1]);
        Game.addCardPlayQueue(highestCards[highestCards.length - 2]);
        Game.addCardPlayQueue(highestCards[highestCards.length - 3]);
    }

    /*
        When we're starting the turn
     */
    leadCardLogic(isFirstTurn: boolean, isHeartsBroken: boolean) {
        // means we have the two of clubs
        if (isFirstTurn) {
            Game.addCardPlayQueue(this.cards["clubs"][0]);
            return;
        }

        var currentTurn = Round.getCurrentTurn();

        // pick a high symbol card in the first rounds (of clubs or diamonds)
        if (
            currentTurn <= 3 &&
            (this.cards["clubs"].length > 0 ||
                this.cards["diamonds"].length > 0)
        ) {
            var highest = this.getHighestCard(["clubs", "diamonds"]);

            Game.addCardPlayQueue(highest!);
        }

        // otherwise pick a low symbol card
        else {
            // if we don't have anything above the queen of spades, try to force it out by playing spades
            var aboveQueenSpades = false;
            var spadesCards = this.cards["spades"];

            for (let a = 0; a < spadesCards.length; a++) {
                if (cardEqualOrHigherThan(spadesCards[a], "queen")) {
                    aboveQueenSpades = true;
                    break;
                }
            }

            if (!aboveQueenSpades && spadesCards.length > 0) {
                Game.addCardPlayQueue(spadesCards[spadesCards.length - 1]);
                return;
            }

            // otherwise just play some random low symbol card
            var suits: Suit[] = ["clubs", "diamonds", "spades"];

            if (
                isHeartsBroken ||
                this.cards["hearts"].length === this.cardsCount
            ) {
                suits.push("hearts");
            }

            var lowest = this.getLowestCard(suits);

            // don't play the queen of spades as long as there's other spades cards
            if (lowest.suit == "spades" && lowest.suitSymbol == "queen") {
                if (this.cards["spades"].length > 1) {
                    // lowest is queen so its position 0 in array, so we can just get the next card
                    lowest = this.cards["spades"][1];
                }
            }

            Game.addCardPlayQueue(lowest);
        }
    }

    /*
        We're following the lead
     */
    respondCardLogic(isFirstTurn: boolean, leadCard: IndividualCard) {
        var leadSuit = leadCard.suit;
        var cards = this.cards[leadSuit];
        var cardsPlayed = Round.cardsPlayed();

        // check if we have cards of that suit
        if (cards.length > 0) {
            // if a card higher than the queen of spades has been played, we play queen of spades (if we have it)
            if (leadSuit == "spades" && cardHigherThan(leadCard, "queen")) {
                for (let a = 0; a < cards.length; a++) {
                    card = cards[a];

                    if (card.suitSymbol === "queen") {
                        Game.addCardPlayQueue(card);
                        return;
                    }
                }
            }

            // find the highest value played in the turn
            var highestSymbol = leadCard.suitSymbol;

            for (let a = 1; a < cardsPlayed.length; a++) {
                card = cardsPlayed[a];

                // only the cards of the same suit as the lead matter
                if (card.suit == leadSuit) {
                    if (cardHigherThan(card, highestSymbol)) {
                        highestSymbol = card.suitSymbol;
                    }
                }
            }

            var closestBelow: IndividualCard | null = null;
            var closestAbove: IndividualCard | null = null;

            // from the cards we have, find the closest to the highest card played
            for (let a = 0; a < cards.length; a++) {
                var card = cards[a];

                if (cardLowerThan(card, highestSymbol)) {
                    if (closestBelow === null) {
                        closestBelow = card;
                    } else if (cardLowerThan(closestBelow, card.suitSymbol)) {
                        closestBelow = card;
                    }
                } else if (cardHigherThan(card, highestSymbol)) {
                    if (closestAbove === null) {
                        closestAbove = card;
                    } else if (cardHigherThan(closestAbove, card.suitSymbol)) {
                        closestAbove = card;
                    }
                }
            }

            // playing the card just below the lead takes priority (so that we don't win the turn)
            if (closestBelow !== null) {
                Game.addCardPlayQueue(closestBelow);
            } else {
                // if we're the last one playing in the round, and we don't have a card below (so we're winning the round regardless), we can play the highest card we have
                if (cardsPlayed.length === 3) {
                    Game.addCardPlayQueue(cards[cards.length - 1]);
                } else {
                    // don't play the queen of spades as long as there's other spades cards
                    if (
                        closestAbove!.suit == "spades" &&
                        closestAbove!.suitSymbol == "queen"
                    ) {
                        if (this.cards["spades"].length > 1) {
                            closestAbove = this.cards["spades"][1];
                        }
                    }

                    Game.addCardPlayQueue(closestAbove!);
                }
            }
        } else {
            // can't play hearts or queen of spades in the first turn (unless that's all we have)
            // try to play a spades if we have any above the queen
            // otherwise play the highest diamonds card
            if (isFirstTurn) {
                var spadesCards = this.cards["spades"];

                for (let a = spadesCards.length - 1; a >= 0; a--) {
                    card = spadesCards[a];

                    if (cardHigherThan(card, "queen")) {
                        Game.addCardPlayQueue(card);
                        return;
                    }
                }

                var suits: Suit[] = ["diamonds"];

                var highest = this.getHighestCard(suits);

                if (highest !== null) {
                    Game.addCardPlayQueue(highest);
                }

                // we don't have clubs cards (since we failed to respond to the 2 of clubs lead of the first turn)
                // we don't have spades higher than the queen
                // we don't have diamonds
                // try to play a spades card (starting at the lower card)
                // and if that fails as well, play a hearts (we have all 13 hearts)
                else {
                    if (spadesCards.length > 0) {
                        Game.addCardPlayQueue(spadesCards[0]);
                    } else {
                        var heartsCards = this.cards["hearts"];

                        Game.addCardPlayQueue(
                            heartsCards[heartsCards.length - 1]
                        );
                    }
                }
            }

            // play queen of spades if we have it
            // play a hearts if we have it
            // otherwise just play the highest symbol we have
            else {
                var spadesCards = this.cards["spades"];

                for (let a = 0; a < spadesCards.length; a++) {
                    card = spadesCards[a];

                    if (card.suitSymbol === "queen") {
                        Game.addCardPlayQueue(card);
                        return;
                    }
                }

                var heartsCards = this.cards["hearts"];

                if (heartsCards.length > 0) {
                    Game.addCardPlayQueue(heartsCards[heartsCards.length - 1]);
                    return;
                }

                var highest = this.getHighestCard(ALL_SUITS);

                Game.addCardPlayQueue(highest!);
            }
        }
    }

    getHighestCard(suits: Suit[]) {
        var highestCards = [];
        var a;

        for (a = 0; a < suits.length; a++) {
            var cards = this.cards[suits[a]];

            if (cards.length > 0) {
                highestCards.push(cards[cards.length - 1]);
            }
        }

        var highest = null;

        if (highestCards.length > 0) {
            highest = highestCards[0];

            for (a = 1; a < highestCards.length; a++) {
                var card = highestCards[a];

                if (cardHigherThan(card, highest.suitSymbol)) {
                    highest = card;
                }
            }
        }

        return highest;
    }

    getLowestCard(suits: Suit[]) {
        var lowestCards = [];
        var a;

        for (a = 0; a < suits.length; a++) {
            var cards = this.cards[suits[a]];

            if (cards.length > 0) {
                lowestCards.push(cards[0]);
            }
        }

        var lowest = lowestCards[0];

        for (a = 1; a < lowestCards.length; a++) {
            var card = lowestCards[a];

            if (cardLowerThan(card, lowest.suitSymbol)) {
                lowest = card;
            }
        }

        return lowest;
    }
}
