import * as AppStorage from "./app_storage";
import * as Statistics from "./statistics";
import * as Canvas from "./canvas";
import * as Preload from "./preload";
import { start } from "./game";
import "../css/style.css";

/*
    classes:
        - Card:
            - draw card, move

        - Player:
            - position the cards in order of suit (clubs / diamonds / spades / hearts)
            - can be shown (for the player) / hidden (the bots)
            - position in top/bottom/left/right

        - Bot (inherits from Player):
            - has the bot game logic

        - Round:
            - receives each players card
            - position them in the center
            - determines if a player move is valid or not

        - Game:
            - which turn it is
            - knows if the hearts have been broken or not

        - GameMenu:
            - current players points
            - restart
 */

let DEBUG: boolean;

window.onload = function() {
    AppStorage.getData(["hearts_statistics"], function(data) {
        Statistics.load(data["hearts_statistics"]);
        initApp();
    });
};

function initApp() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    Canvas.init();

    const loadMessage = document.getElementById("LoadMessage")!;
    loadMessage.classList.remove("hidden");

    Preload.init({
        duringLoading: (progress) => {
            loadMessage.innerText = progress + "%";
        },
        onEnd: () => {
            loadMessage.classList.add("hidden");
            start(Canvas.getCanvasElement());
        },
    });
}

export function debugMode() {
    return DEBUG;
}
