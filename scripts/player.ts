import * as Message from "./message";
import { Position, CARD_SPEED } from "./game";
import {
    getRandom,
    Suit,
    SuitSymbol,
    setAvailable,
    sortCardsBySymbol,
    ALL_SUITS,
} from "./cards";
import { getCanvasDimensions } from "./canvas";
import IndividualCard from "./individual_card";

export interface PlayerArgs {
    show: boolean; // show or hide the cards
    position: Position;
    isBot?: boolean;
}

export type PlayerCards = {
    [key in Suit]: IndividualCard[];
};

export default class Player {
    static startingCards = 13;
    static step = 40;

    readonly cards: PlayerCards;
    readonly isBot: boolean;
    readonly selectedCards: IndividualCard[];
    readonly position: Position;

    private centerX = 0;
    private centerY = 0;
    private horizontalOrientation = true;
    private cardsCount: number;
    private points: number;
    private show: boolean;

    constructor(args: PlayerArgs) {
        if (typeof args.isBot === "undefined") {
            args.isBot = false;
        }

        this.cardsCount = 0;
        this.position = args.position;
        this.show = args.show;
        this.cards = {
            clubs: [],
            diamonds: [],
            spades: [],
            hearts: [],
        };
        this.points = 0;
        this.selectedCards = [];
        this.isBot = args.isBot;
    }

    getHand() {
        var cards = [];

        for (var a = 0; a < Player.startingCards; a++) {
            var card = getRandom();
            card.setPlayer(this);

            if (!this.isBot) {
                card.setClickEvent(true);
            }

            card.changeSide(false);
            cards.push(card);
        }

        this.cardsCount = Player.startingCards;

        this.cards.clubs = cards.filter(function(element) {
            return element.suit === "clubs";
        });
        this.cards.diamonds = cards.filter(function(element) {
            return element.suit === "diamonds";
        });
        this.cards.spades = cards.filter(function(element) {
            return element.suit === "spades";
        });
        this.cards.hearts = cards.filter(function(element) {
            return element.suit === "hearts";
        });

        // order the cards by the symbol
        this.cards.clubs = sortCardsBySymbol(this.cards.clubs);
        this.cards.diamonds = sortCardsBySymbol(this.cards.diamonds);
        this.cards.spades = sortCardsBySymbol(this.cards.spades);
        this.cards.hearts = sortCardsBySymbol(this.cards.hearts);

        this.updateCenterPosition();
        this.positionCards(CARD_SPEED.back);
    }

    updateCenterPosition() {
        const { width, height } = getCanvasDimensions();
        const canvasHalfWidth = width / 2;
        const canvasHalfHeight = height / 2;
        const cardWidth = IndividualCard.width;
        const cardHeight = IndividualCard.height;

        if (this.position === "south") {
            this.centerX = canvasHalfWidth;
            this.centerY = height - cardHeight;

            this.horizontalOrientation = true;
        } else if (this.position === "north") {
            this.centerX = canvasHalfWidth;
            this.centerY = 0;

            this.horizontalOrientation = true;
        } else if (this.position === "east") {
            this.centerX = width - cardWidth;
            this.centerY = canvasHalfHeight;

            this.horizontalOrientation = false;
        } else if (this.position === "west") {
            this.centerX = 0;
            this.centerY = canvasHalfHeight;

            this.horizontalOrientation = false;
        } else {
            throw new Error("error, wrong position argument");
        }
    }

    private getPositionValues(cardsCount: number) {
        if (this.horizontalOrientation) {
            const allCardsLength =
                IndividualCard.width + (cardsCount - 1) * Player.step;

            return {
                x: this.centerX - allCardsLength / 2,
                y: this.centerY,
                stepX: Player.step,
                stepY: 0,
            };
        } else {
            const allCardsLength =
                IndividualCard.height + (cardsCount - 1) * Player.step;

            return {
                x: this.centerX,
                y: this.centerY - allCardsLength / 2,
                stepX: 0,
                stepY: Player.step,
            };
        }
    }

    private moveCard(
        card: IndividualCard,
        x: number,
        y: number,
        animationDuration: number,
        callback?: (card: IndividualCard) => void
    ) {
        card.show();

        if (animationDuration === 0) {
            card.setPosition(x, y);

            if (card.selected) {
                this.moveSelectedCard(card, true, animationDuration);
            }
        } else {
            card.moveTo(x, y, animationDuration, callback);
        }
    }

    positionCards(animationDuration: number) {
        let callback;
        let { x, y, stepX, stepY } = this.getPositionValues(this.cardsCount);

        if (this.show) {
            callback = function(card: IndividualCard) {
                card.changeSide(true);
            };
        }

        for (let a = 0; a < this.cards.clubs.length; a++) {
            const card = this.cards.clubs[a];
            this.moveCard(card, x, y, animationDuration, callback);

            x += stepX;
            y += stepY;
        }

        for (let a = 0; a < this.cards.diamonds.length; a++) {
            const card = this.cards.diamonds[a];
            this.moveCard(card, x, y, animationDuration, callback);

            x += stepX;
            y += stepY;
        }

        for (let a = 0; a < this.cards.spades.length; a++) {
            const card = this.cards.spades[a];
            this.moveCard(card, x, y, animationDuration, callback);

            x += stepX;
            y += stepY;
        }

        for (let a = 0; a < this.cards.hearts.length; a++) {
            const card = this.cards.hearts[a];
            this.moveCard(card, x, y, animationDuration, callback);

            x += stepX;
            y += stepY;
        }
    }

    /**
     * Position the given cards on the player side.
     */
    positionGivenCards(cards: IndividualCard[]) {
        const cardsCount = cards.length;
        let { x, y, stepX, stepY } = this.getPositionValues(cardsCount);

        cards.forEach((card) => {
            card.show();
            card.moveTo(x, y, CARD_SPEED.back);

            x += stepX;
            y += stepY;
        });
    }

    hasCard(suit: Suit, symbol: SuitSymbol) {
        var array: IndividualCard[] = this.cards[suit];

        for (var a = 0; a < array.length; a++) {
            if (array[a].suitSymbol == symbol) {
                return true;
            }
        }

        return false;
    }

    /**
     * Moves the card slightly to the center (or away from it).
     * Useful to know visually which cards are selected in the pass cards phase.
     */
    moveSelectedCard(
        card: IndividualCard,
        towardsCenter: boolean,
        animationDuration: number
    ) {
        var x = card.getX();
        var y = card.getY();
        var offset = 40;

        if (towardsCenter === false) {
            offset *= -1;
        }

        if (this.position === "north") {
            y += offset;
        } else if (this.position === "south") {
            y -= offset;
        } else if (this.position === "west") {
            x += offset;
        } else if (this.position === "east") {
            x -= offset;
        } else {
            throw new Error("error, wrong position argument");
        }

        card.moveTo(x, y, animationDuration);
    }

    /*
        For the pass cards phase (where you pass 3 cards to other player)
     */
    selectCard(card: IndividualCard) {
        // see if we're clicking on a already selected card (if so, we deselect it)
        var index = this.selectedCards.indexOf(card);
        if (index > -1) {
            this.selectedCards.splice(index, 1);
            card.selected = false;

            // move the card back to the original position
            this.moveSelectedCard(card, false, 150);
        } else {
            if (this.selectedCards.length >= 3) {
                Message.open(
                    "Only 3 cards.",
                    "Can't select more than 3 cards."
                );
                return;
            }

            card.selected = true;
            this.selectedCards.push(card);
            this.moveSelectedCard(card, true, 150);
        }
    }

    /*
        Removes the selected cards and returns an array with them
     */

    removeSelectedCards() {
        var cards = [];

        for (var a = 0; a < this.selectedCards.length; a++) {
            var card = this.selectedCards[a];
            card.selected = false;

            cards.push(this.removeCard(card));
        }

        this.selectedCards.length = 0;

        return cards;
    }

    getCardsCount() {
        return this.cardsCount;
    }

    getCenterPosition() {
        return {
            x: this.centerX,
            y: this.centerY,
        };
    }

    addCard(card: IndividualCard) {
        const suit = card.suit;

        this.cards[suit].push(card);
        this.cards[suit] = sortCardsBySymbol(this.cards[suit]);

        card.setPlayer(this);

        if (!this.isBot) {
            card.setClickEvent(true);
            card.changeSide(true);
        } else {
            card.changeSide(false);
        }

        this.cardsCount++;
    }

    removeCard(card: IndividualCard) {
        var array = this.cards[card.suit];
        var index = array.indexOf(card);
        array.splice(index, 1)[0];

        card.selected = false;

        if (!this.isBot) {
            card.setClickEvent(false);
        }

        this.cardsCount--;

        return card;
    }

    changeCardsSide(front: boolean) {
        for (let a = 0; a < ALL_SUITS.length; a++) {
            const suitKey = ALL_SUITS[a];
            const cards = this.cards[suitKey];

            for (let b = 0; b < cards.length; b++) {
                cards[a].changeSide(front);
            }
        }
    }

    clear() {
        this.points = 0;

        for (var a = 0; a < ALL_SUITS.length; a++) {
            const suitKey = ALL_SUITS[a];
            var cards = this.cards[suitKey];

            for (var b = cards.length - 1; b >= 0; b--) {
                var card = cards[b];

                card.moveAnimation.clear();
                this.removeCard(card);
                setAvailable(card);
            }
        }

        this.selectedCards.length = 0;
    }

    addPoints(points: number) {
        this.points += points;
    }

    getPoints() {
        return this.points;
    }

    yourTurn() {
        // called when its this player's turn to play
        // for the human player, this has nothing (card is played with the click event on the cards)
        // the bot player will decide what to play here
    }
}
