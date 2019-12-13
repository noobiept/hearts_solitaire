import * as Statistics from "./statistics";
import {
    Position,
    restart as gameRestart,
    getPlayer,
    ALL_POSITIONS,
} from "./game";

type ScoresData = {
    [key in Position]: HTMLElement;
};

type StatisticsElements = {
    gamesPlayed: HTMLElement;
    gamesWon: HTMLElement;
    winRate: HTMLElement;
};

// scores for the 4 players, has the html reference
var SCORES: ScoresData;
var STATISTICS: StatisticsElements;

var PLAYER_TURN: Position | null = null;

export function init() {
    const menu = document.getElementById("GameMenu")!;

    SCORES = {
        south: menu.querySelector("#south") as HTMLElement,
        west: menu.querySelector("#west") as HTMLElement,
        north: menu.querySelector("#north") as HTMLElement,
        east: menu.querySelector("#east") as HTMLElement,
    };
    STATISTICS = {
        gamesPlayed: menu.querySelector("#gamesPlayed") as HTMLElement,
        gamesWon: menu.querySelector("#gamesWon") as HTMLElement,
        winRate: menu.querySelector("#winRate") as HTMLElement,
    };

    const restart = menu.querySelector("#Restart") as HTMLElement;
    restart.onclick = gameRestart;

    menu.classList.remove("hidden");
}

export function updateScores() {
    for (let a = 0; a < ALL_POSITIONS.length; a++) {
        const position = ALL_POSITIONS[a];
        const player = getPlayer(position);
        const spanElement = SCORES[position].querySelector(
            "span"
        ) as HTMLElement;

        spanElement.innerText = player.getPoints().toString();
    }
}

export function updateStatistics() {
    STATISTICS.gamesPlayed.innerText = Statistics.getGamesPlayed().toString();
    STATISTICS.gamesWon.innerText = Statistics.getGamesWon().toString();
    STATISTICS.winRate.innerText = Statistics.getWinRate() + "%";
}

export function setPlayerTurn(position: Position) {
    if (PLAYER_TURN !== null) {
        const previousPlayer = PLAYER_TURN;
        SCORES[previousPlayer].classList.remove("playerTurn");
    }

    const nextPlayer = position;
    SCORES[nextPlayer].classList.add("playerTurn");

    PLAYER_TURN = position;
}
