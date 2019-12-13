import Player from "./player.js";
import Bot from "./bot.js";
import * as Cards from "./cards.js";
import * as Round from "./round.js";
import * as GameMenu from "./game_menu.js";
import * as MoveAnimation from "./move_animation.js";
import * as Message from "./message.js";
import * as PassCards from "./pass_cards.js";
import * as Statistics from "./statistics.js";
import { debugMode } from "./main.js";
import { onCanvasRightClick, resizeCanvas } from "./canvas";
import IndividualCard from "./individual_card.js";

export type Position = "south" | "west" | "north" | "east";

// in the play order (clock-wise)
export const ALL_POSITIONS: Position[] = ["south", "west", "north", "east"];

export type Pass = "left" | "right" | "across";

// 'south' is the human player
type AllPlayers = {
    [key in Position]: Player;
};

let STAGE: createjs.Stage;
var PLAYERS: AllPlayers;

var ACTIVE_PLAYER: Player;
var PASS_CARDS_PHASE: boolean;

var PASS_CARDS: Pass = "left";

// wait until the card animations end, until we play other cards
var PLAY_QUEUE: IndividualCard[] = [];

export function start(canvas: HTMLCanvasElement) {
    STAGE = new createjs.Stage(canvas);

    // show the game menu before resizing (so it considers its dimension)
    GameMenu.init();

    // need to resize the canvas in the beginning to fit the available width/height (before any element is added)
    resizeCanvas();

    Cards.init();
    MoveAnimation.init();
    Message.init();
    PassCards.init();

    var showBotCards = false;

    if (debugMode() === true) {
        showBotCards = true;
    }

    PLAYERS = {
        south: new Player({
            show: true,
            position: "south",
        }),

        north: new Bot({
            show: showBotCards,
            position: "north",
        }),

        east: new Bot({
            show: showBotCards,
            position: "east",
        }),

        west: new Bot({
            show: showBotCards,
            position: "west",
        }),
    };

    GameMenu.updateScores();
    GameMenu.updateStatistics();
    Round.clearRound();

    createjs.Ticker.on("tick", tick);

    // called when you press the right button of the mouse
    // force the cards to move immediately to destination
    onCanvasRightClick(() => {
        Round.noMoveAnimationThisTurn();
        Cards.forceMoveToDestination();
    });

    drawCards();
    window.onresize = resize;
}

export function drawCards() {
    for (let a = 0; a < ALL_POSITIONS.length; a++) {
        const position = ALL_POSITIONS[a];
        const player = PLAYERS[position];

        player.getHand();
    }

    PASS_CARDS_PHASE = true;

    for (var a = 0; a < ALL_POSITIONS.length; a++) {
        PLAYERS[ALL_POSITIONS[a]].yourTurn();
    }

    PassCards.select(PASS_CARDS);

    // in the pass cards phase, the turn is for the human player (since the bots play immediately)
    GameMenu.setPlayerTurn("south");
}

export function passCards() {
    Message.close();

    for (var a = 0; a < ALL_POSITIONS.length; a++) {
        var player: Player = PLAYERS[ALL_POSITIONS[a]];

        if (player.selectedCards.length < 3) {
            Message.open(
                "Select 3 cards.",
                "Need to select 3 cards to pass to another player."
            );
            return;
        }
    }

    var pass = function(from: Position, to: Position) {
        var cards = PLAYERS[from].removeSelectedCards();

        for (a = 0; a < cards.length; a++) {
            PLAYERS[to].addCard(cards[a]);
        }
    };

    // clockwise order
    if (PASS_CARDS == "left") {
        pass("south", "west");
        pass("west", "north");
        pass("north", "east");
        pass("east", "south");
    }

    // anti-clockwise order
    else if (PASS_CARDS == "right") {
        pass("south", "east");
        pass("east", "north");
        pass("north", "west");
        pass("west", "south");
    } else if (PASS_CARDS == "across") {
        pass("south", "north");
        pass("north", "south");
        pass("east", "west");
        pass("west", "east");
    } else {
        console.log("Wrong value in PASS_CARDS.");
        return;
    }

    for (var a = 0; a < ALL_POSITIONS.length; a++) {
        PLAYERS[ALL_POSITIONS[a]].positionCards(400);
    }

    PASS_CARDS_PHASE = false;

    // move to the next order
    switch (PASS_CARDS) {
        case "left":
            PASS_CARDS = "right";
            break;

        case "right":
            PASS_CARDS = "across";
            break;

        case "across":
            PASS_CARDS = "left";
            break;
    }

    PassCards.hide();
    startRound();
}

export function startRound() {
    // determine who starts playing (who has the 2 of clubs)
    for (let a = 0; a < ALL_POSITIONS.length; a++) {
        const position = ALL_POSITIONS[a];
        const player = PLAYERS[position];

        if (player.hasCard("clubs", "two")) {
            ACTIVE_PLAYER = player;
            break;
        }
    }

    ACTIVE_PLAYER.yourTurn();
    GameMenu.setPlayerTurn(ACTIVE_PLAYER.position);
}

export function isValidMove(card: IndividualCard) {
    if (PASS_CARDS_PHASE) {
        return true;
    }

    var player = card.player;

    if (player !== ACTIVE_PLAYER) {
        Message.open(
            "Other player's turn.",
            "Its " + ACTIVE_PLAYER.position + " turn"
        );
        return false;
    }

    return Round.isValidMove(card);
}

export function addCardPlayQueue(card: IndividualCard) {
    PLAY_QUEUE.push(card);
}

export function playCard(card: IndividualCard) {
    var player = card.player;

    if (PASS_CARDS_PHASE) {
        player.selectCard(card);

        if (!player.isBot) {
            if (player.selectedCards.length >= 3) {
                PassCards.addEffect();
            } else {
                PassCards.removeEffect();
            }
        }
    } else {
        player.removeCard(card);
        player.positionCards(150);
        Round.playCard(card);
    }
}

export function cardPlayed() {
    var winner = Round.getTurnWinner();

    // turn ended
    if (winner) {
        // check if the round has ended (when there's no more cards to be played)
        // we can check in any player (since they all have the same amount of cards)
        if (ACTIVE_PLAYER.cardCount() === 0) {
            // round ended
            // update the points
            var gameEnded = updatePoints();
            var message = "";

            if (gameEnded) {
                message += "Game Ended!<br />";

                var winners = getPlayersWinning();
                var southWon = false; // see if the human player won

                for (var a = 0; a < winners.length; a++) {
                    var position = winners[a].position;

                    message += position + " Won!<br /><br />";

                    if (position == "south") {
                        southWon = true;
                    }
                }

                Statistics.oneMoreGame(southWon);
            }

            ALL_POSITIONS.forEach((playerPosition) => {
                const aPlayer = PLAYERS[playerPosition];

                message +=
                    aPlayer.position + ": " + aPlayer.getPoints() + "<br />";
            });

            Message.openModal("Round ended", message, () => {
                if (gameEnded) {
                    restart();
                } else {
                    // start new round
                    Cards.centerCards();
                    Round.clearRound();
                    drawCards();
                }
            });
        } else {
            // the player that has won will start the next turn
            ACTIVE_PLAYER = winner;
            ACTIVE_PLAYER.yourTurn();

            GameMenu.setPlayerTurn(ACTIVE_PLAYER.position);
        }
    }

    // round still going on, go to next player
    else {
        // give turn to next player
        let nextPosition = ACTIVE_PLAYER.position;

        switch (nextPosition) {
            case "south":
                nextPosition = "west";
                break;

            case "west":
                nextPosition = "north";
                break;

            case "north":
                nextPosition = "east";
                break;

            case "east":
                nextPosition = "south";
                break;
        }

        ACTIVE_PLAYER = PLAYERS[nextPosition];
        ACTIVE_PLAYER.yourTurn();

        GameMenu.setPlayerTurn(ACTIVE_PLAYER.position);
    }
}

function updatePoints() {
    var points = Round.getPoints();
    var gameEnded = false;

    for (var a = 0; a < ALL_POSITIONS.length; a++) {
        var position = ALL_POSITIONS[a];

        var player = PLAYERS[position];

        player.addPoints(points[position]);

        if (player.getPoints() > 100) {
            gameEnded = true;
        }
    }

    GameMenu.updateScores();

    return gameEnded;
}

/*
    Returns an array with the players who are currently winning (those who have less points)
    There's at least one player, but can be more (2 max. ?..)
 */
function getPlayersWinning() {
    var position = ALL_POSITIONS[0];
    var playersWinning = [PLAYERS[position]];

    for (var a = 1; a < ALL_POSITIONS.length; a++) {
        position = ALL_POSITIONS[a];
        var player = PLAYERS[position];
        var playerPoints = player.getPoints();
        var winningPoints = playersWinning[0].getPoints();

        if (playerPoints < winningPoints) {
            playersWinning = [player];
        } else if (playerPoints == winningPoints) {
            playersWinning.push(player);
        }
    }

    return playersWinning;
}

export function getPlayer(position: Position) {
    return PLAYERS[position];
}

export function restart() {
    for (var a = 0; a < ALL_POSITIONS.length; a++) {
        var player = PLAYERS[ALL_POSITIONS[a]];

        player.clear();
    }

    GameMenu.updateScores();
    GameMenu.updateStatistics();

    // start new round
    Cards.centerCards();
    Round.clearRound();
    drawCards();
}

export function isPassCardsPhase() {
    return PASS_CARDS_PHASE;
}

export function tick() {
    // play a new card only when there's no card moving
    if (!Cards.isMoving()) {
        while (PLAY_QUEUE.length > 0) {
            var card = PLAY_QUEUE.pop()!;

            if (isValidMove(card)) {
                playCard(card);
            }
        }
    }

    STAGE.update();
}

/**
 * Reposition/resize the game elements, based on the current available width/height of the window.
 */
export function resize() {
    const dimensions = resizeCanvas();
    PassCards.setPosition(dimensions.width / 2, dimensions.height / 2);

    PLAYERS.north.updateCenterPosition();
    PLAYERS.north.positionCards(0);
    PLAYERS.south.updateCenterPosition();
    PLAYERS.south.positionCards(0);
    PLAYERS.east.updateCenterPosition();
    PLAYERS.east.positionCards(0);
    PLAYERS.west.updateCenterPosition();
    PLAYERS.west.positionCards(0);

    Round.resize(dimensions);
}

/**
 * Add an element to the stage (to be displayed).
 */
export function addToStage(element: createjs.DisplayObject) {
    STAGE.addChild(element);
}

/**
 * Remove an element from the stage.
 */
export function removeFromStage(element: createjs.DisplayObject) {
    STAGE.removeChild(element);
}
