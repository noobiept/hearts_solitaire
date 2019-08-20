import Player from "./player.js";
import Bot from "./bot.js";
import * as Cards from "./cards.js";
import * as Round from "./round.js";
import * as GameMenu from "./game_menu.js";
import * as MoveAnimation from "./move_animation.js";
import * as Message from "./message.js";
import * as PassCards from "./pass_cards.js";
import * as Statistics from "./statistics.js";
import { G } from "./main.js";

export enum Position {
    south,
    west,
    north,
    east,
}

interface AllPlayers {
    south: Player; // human player
    west: Player;
    north: Player;
    east: Player;
}

var PLAYERS: AllPlayers;

// in the play order (clock-wise)
var PLAYERS_POSITION = ["south", "west", "north", "east"];

var ACTIVE_PLAYER: Player = null;
var PASS_CARDS_PHASE: boolean;

export enum Pass {
    left,
    right,
    across,
}

var PASS_CARDS = Pass.left;

// wait until the card animations end, until we play other cards
var PLAY_QUEUE: Cards.IndividualCard[] = [];

export function start() {
    // need to resize the canvas in the beginning to fit the available width/height (before any element is added)
    resizeCanvas();

    Cards.init();
    MoveAnimation.init();
    Message.init();
    PassCards.init();

    var showBotCards = false;

    if (G.DEBUG === true) {
        showBotCards = true;
    }

    PLAYERS = {
        south: new Player({
            show: true,
            position: Position.south,
        }),

        north: new Bot({
            show: showBotCards,
            position: Position.north,
        }),

        east: new Bot({
            show: showBotCards,
            position: Position.east,
        }),

        west: new Bot({
            show: showBotCards,
            position: Position.west,
        }),
    };

    GameMenu.init();
    GameMenu.updateScores();
    GameMenu.updateStatistics();
    Round.clearRound();

    createjs.Ticker.on("tick", tick);

    // called when you press the right button of the mouse
    // disable the context menu
    // force the cards to move immediately to destination
    G.CANVAS.oncontextmenu = function(event) {
        // right click
        if (event.button == 2) {
            Round.noMoveAnimationThisTurn();
            Cards.forceMoveToDestination();
        }

        return false;
    };

    drawCards();
    window.onresize = resize;
}

export function drawCards() {
    var player: Player;
    var position;

    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        position = PLAYERS_POSITION[a];

        player = PLAYERS[position];

        player.getHand();
    }

    PASS_CARDS_PHASE = true;

    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        PLAYERS[PLAYERS_POSITION[a]].yourTurn();
    }

    PassCards.select(PASS_CARDS);

    // in the pass cards phase, the turn is for the human player (since the bots play immediately)
    GameMenu.setPlayerTurn(Position.south);
}

export function passCards() {
    Message.close();

    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        var player: Player = PLAYERS[PLAYERS_POSITION[a]];

        if (player.selectedCards.length < 3) {
            Message.open(
                "Select 3 cards.",
                "Need to select 3 cards to pass to another player."
            );
            return;
        }
    }

    var pass = function(from, to) {
        var cards = PLAYERS[from].removeSelectedCards();

        for (a = 0; a < cards.length; a++) {
            PLAYERS[to].addCard(cards[a]);
        }
    };

    // clockwise order
    if (PASS_CARDS == Pass.left) {
        pass("south", "west");
        pass("west", "north");
        pass("north", "east");
        pass("east", "south");
    }

    // anti-clockwise order
    else if (PASS_CARDS == Pass.right) {
        pass("south", "east");
        pass("east", "north");
        pass("north", "west");
        pass("west", "south");
    } else if (PASS_CARDS == Pass.across) {
        pass("south", "north");
        pass("north", "south");
        pass("east", "west");
        pass("west", "east");
    } else {
        console.log("Wrong value in PASS_CARDS.");
        return;
    }

    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        PLAYERS[PLAYERS_POSITION[a]].positionCards(400);
    }

    PASS_CARDS_PHASE = false;
    PASS_CARDS++;
    if (PASS_CARDS >= 3) {
        // its either left, right or across
        PASS_CARDS = 0;
    }

    PassCards.hide();
    startRound();
}

export function startRound() {
    var player;
    var position;

    // determine who starts playing (who has the 2 of clubs)
    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        position = PLAYERS_POSITION[a];
        player = PLAYERS[position];

        if (player.hasCard(Cards.Suit.clubs, Cards.SuitSymbol.two)) {
            ACTIVE_PLAYER = player;
            break;
        }
    }

    ACTIVE_PLAYER.yourTurn();
    GameMenu.setPlayerTurn(ACTIVE_PLAYER.position);
}

export function isValidMove(card: Cards.IndividualCard) {
    if (PASS_CARDS_PHASE) {
        return true;
    }

    var player = card.player;

    if (player !== ACTIVE_PLAYER) {
        Message.open(
            "Other player's turn.",
            "Its " + Position[ACTIVE_PLAYER.position] + " turn"
        );
        return false;
    }

    return Round.isValidMove(card);
}

export function addCardPlayQueue(card: Cards.IndividualCard) {
    PLAY_QUEUE.push(card);
}

export function playCard(card: Cards.IndividualCard) {
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

                    message += Position[position] + " Won!<br /><br />";

                    if (position == Position.south) {
                        southWon = true;
                    }
                }

                Statistics.oneMoreGame(southWon);
            }

            PLAYERS_POSITION.forEach((playerPosition) => {
                const aPlayer = PLAYERS[playerPosition];

                message +=
                    Position[aPlayer.position] +
                    ": " +
                    aPlayer.getPoints() +
                    "<br />";
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
        var index = ACTIVE_PLAYER.position;

        index++;

        if (index >= PLAYERS_POSITION.length) {
            index = 0;
        }

        ACTIVE_PLAYER = PLAYERS[Position[index]];
        ACTIVE_PLAYER.yourTurn();

        GameMenu.setPlayerTurn(ACTIVE_PLAYER.position);
    }
}

function updatePoints() {
    var points = Round.getPoints();
    var gameEnded = false;

    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        var position = PLAYERS_POSITION[a];

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
    var position = PLAYERS_POSITION[0];
    var playersWinning = [PLAYERS[position]];

    for (var a = 1; a < PLAYERS_POSITION.length; a++) {
        position = PLAYERS_POSITION[a];
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
    return PLAYERS[Position[position]];
}

export function restart() {
    for (var a = 0; a < PLAYERS_POSITION.length; a++) {
        var player = PLAYERS[PLAYERS_POSITION[a]];

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
            var card = PLAY_QUEUE.pop();

            if (isValidMove(card)) {
                playCard(card);
            }
        }
    }

    G.STAGE.update();
}

function resizeCanvas() {
    var windowWidth = $(window).outerWidth(true);
    var gameMenuWidth = $("#GameMenu").outerWidth(true);
    var windowHeight = $(window).outerHeight(true);

    var canvasWidth = windowWidth - gameMenuWidth - 20;
    var canvasHeight = windowHeight;

    G.CANVAS.width = canvasWidth;
    G.CANVAS.height = canvasHeight;
}

/**
 * Reposition/resize the game elements, based on the current available width/height of the window.
 */
export function resize() {
    resizeCanvas();
    PassCards.setPosition(G.CANVAS.width / 2, G.CANVAS.height / 2);

    PLAYERS.north.updateCenterPosition();
    PLAYERS.north.positionCards(0);
    PLAYERS.south.updateCenterPosition();
    PLAYERS.south.positionCards(0);
    PLAYERS.east.updateCenterPosition();
    PLAYERS.east.positionCards(0);
    PLAYERS.west.updateCenterPosition();
    PLAYERS.west.positionCards(0);

    Round.resize();
}
