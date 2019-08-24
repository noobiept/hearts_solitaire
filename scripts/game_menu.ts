import * as Statistics from "./statistics.js";
import { Position, restart as gameRestart, getPlayer } from "./game.js";

// scores for the 4 players, has the html reference
var SCORES = {
    south: null,
    west: null,
    north: null,
    east: null,
};

var STATISTICS = {
    gamesPlayed: null,
    gamesWon: null,
    winRate: null,
};

var PLAYER_TURN: Position | null = null;

export function init() {
    const menu = document.getElementById("GameMenu")!;

    SCORES["south"] = menu.querySelector("#south");
    SCORES["west"] = menu.querySelector("#west");
    SCORES["north"] = menu.querySelector("#north");
    SCORES["east"] = menu.querySelector("#east");

    STATISTICS.gamesPlayed = menu.querySelector("#gamesPlayed");
    STATISTICS.gamesWon = menu.querySelector("#gamesWon");
    STATISTICS.winRate = menu.querySelector("#winRate");

    var restart = <HTMLDivElement>menu.querySelector("#Restart");
    restart.onclick = gameRestart;

    menu.classList.remove("hidden");
}

export function updateScores() {
    var positions = ["south", "west", "north", "east"];

    for (var a = 0; a < positions.length; a++) {
        var position = positions[a];
        var player = getPlayer(Position[position]);

        var spanElement = SCORES[position].querySelector("span");
        spanElement.innerText = player.getPoints();
    }
}

export function updateStatistics() {
    STATISTICS.gamesPlayed.innerText = Statistics.getGamesPlayed();
    STATISTICS.gamesWon.innerText = Statistics.getGamesWon();
    STATISTICS.winRate.innerText = Statistics.getWinRate() + "%";
}

export function setPlayerTurn(position: Position) {
    if (PLAYER_TURN !== null) {
        const previousPlayer = Position[PLAYER_TURN];
        SCORES[previousPlayer].classList.remove("playerTurn");
    }

    const nextPlayer = Position[position];
    SCORES[nextPlayer].classList.add("playerTurn");

    PLAYER_TURN = position;
}
