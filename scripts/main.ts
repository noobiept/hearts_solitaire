import * as AppStorage from "./app_storage.js";
import * as Statistics from "./statistics.js";
import { start } from "./game.js";
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

export interface CanvasDimensions {
    width: number;
    height: number;
}

let CANVAS: HTMLCanvasElement;
let PRELOAD: createjs.LoadQueue;
let DEBUG: boolean;

window.onload = function() {
    AppStorage.getData(["hearts_statistics"], function(data) {
        Statistics.load(data["hearts_statistics"]);
        initApp();
    });
};

function initApp() {
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    CANVAS = document.querySelector("#MainCanvas");
    PRELOAD = new createjs.LoadQueue();
    PRELOAD.setMaxConnections(10);
    PRELOAD.maintainScriptOrder = false;

    const manifest = [
        { id: "card_back", src: "images/card_back_black.png" },

        { id: "ace_of_clubs", src: "images/ace_of_clubs.png" },
        { id: "two_of_clubs", src: "images/2_of_clubs.png" },
        { id: "three_of_clubs", src: "images/3_of_clubs.png" },
        { id: "four_of_clubs", src: "images/4_of_clubs.png" },
        { id: "five_of_clubs", src: "images/5_of_clubs.png" },
        { id: "six_of_clubs", src: "images/6_of_clubs.png" },
        { id: "seven_of_clubs", src: "images/7_of_clubs.png" },
        { id: "eight_of_clubs", src: "images/8_of_clubs.png" },
        { id: "nine_of_clubs", src: "images/9_of_clubs.png" },
        { id: "ten_of_clubs", src: "images/10_of_clubs.png" },
        { id: "jack_of_clubs", src: "images/jack_of_clubs2.png" },
        { id: "queen_of_clubs", src: "images/queen_of_clubs2.png" },
        { id: "king_of_clubs", src: "images/king_of_clubs2.png" },

        { id: "ace_of_diamonds", src: "images/ace_of_diamonds.png" },
        { id: "two_of_diamonds", src: "images/2_of_diamonds.png" },
        { id: "three_of_diamonds", src: "images/3_of_diamonds.png" },
        { id: "four_of_diamonds", src: "images/4_of_diamonds.png" },
        { id: "five_of_diamonds", src: "images/5_of_diamonds.png" },
        { id: "six_of_diamonds", src: "images/6_of_diamonds.png" },
        { id: "seven_of_diamonds", src: "images/7_of_diamonds.png" },
        { id: "eight_of_diamonds", src: "images/8_of_diamonds.png" },
        { id: "nine_of_diamonds", src: "images/9_of_diamonds.png" },
        { id: "ten_of_diamonds", src: "images/10_of_diamonds.png" },
        { id: "jack_of_diamonds", src: "images/jack_of_diamonds2.png" },
        { id: "queen_of_diamonds", src: "images/queen_of_diamonds2.png" },
        { id: "king_of_diamonds", src: "images/king_of_diamonds2.png" },

        { id: "ace_of_spades", src: "images/ace_of_spades.png" },
        { id: "two_of_spades", src: "images/2_of_spades.png" },
        { id: "three_of_spades", src: "images/3_of_spades.png" },
        { id: "four_of_spades", src: "images/4_of_spades.png" },
        { id: "five_of_spades", src: "images/5_of_spades.png" },
        { id: "six_of_spades", src: "images/6_of_spades.png" },
        { id: "seven_of_spades", src: "images/7_of_spades.png" },
        { id: "eight_of_spades", src: "images/8_of_spades.png" },
        { id: "nine_of_spades", src: "images/9_of_spades.png" },
        { id: "ten_of_spades", src: "images/10_of_spades.png" },
        { id: "jack_of_spades", src: "images/jack_of_spades2.png" },
        { id: "queen_of_spades", src: "images/queen_of_spades2.png" },
        { id: "king_of_spades", src: "images/king_of_spades2.png" },

        { id: "ace_of_hearts", src: "images/ace_of_hearts.png" },
        { id: "two_of_hearts", src: "images/2_of_hearts.png" },
        { id: "three_of_hearts", src: "images/3_of_hearts.png" },
        { id: "four_of_hearts", src: "images/4_of_hearts.png" },
        { id: "five_of_hearts", src: "images/5_of_hearts.png" },
        { id: "six_of_hearts", src: "images/6_of_hearts.png" },
        { id: "seven_of_hearts", src: "images/7_of_hearts.png" },
        { id: "eight_of_hearts", src: "images/8_of_hearts.png" },
        { id: "nine_of_hearts", src: "images/9_of_hearts.png" },
        { id: "ten_of_hearts", src: "images/10_of_hearts.png" },
        { id: "jack_of_hearts", src: "images/jack_of_hearts2.png" },
        { id: "queen_of_hearts", src: "images/queen_of_hearts2.png" },
        { id: "king_of_hearts", src: "images/king_of_hearts2.png" },

        { id: "pass_left", src: "images/pass_left.png" },
        { id: "pass_left_effect", src: "images/pass_left_effect.png" },
        { id: "pass_right", src: "images/pass_right.png" },
        { id: "pass_right_effect", src: "images/pass_right_effect.png" },
        { id: "pass_across", src: "images/pass_across.png" },
        { id: "pass_across_effect", src: "images/pass_across_effect.png" },
    ];

    const loadMessage = document.getElementById("LoadMessage");
    loadMessage.classList.remove("hidden");

    PRELOAD.addEventListener("progress", function(
        event: createjs.ProgressEvent
    ) {
        loadMessage.innerText = ((event.progress * 100) | 0) + "%";
    });
    PRELOAD.addEventListener("complete", function() {
        loadMessage.classList.add("hidden");
        start(CANVAS);
    });
    PRELOAD.loadManifest(manifest, true);
}

export function debugMode() {
    return DEBUG;
}

/**
 * Setup a event listener for when the user right-clicks on the canvas.
 * The context menu is disabled here.
 */
export function onCanvasRightClick(callback: () => void) {
    CANVAS.oncontextmenu = (event) => {
        if (event.button === 2) {
            callback();
        }

        return false;
    };
}

/**
 * Resize the canvas to fit the available window width/height.
 */
export function resizeCanvas() {
    const gameMenu = document.getElementById("GameMenu");
    const gameMenuRect = gameMenu.getBoundingClientRect();

    const windowWidth = window.innerWidth;
    const gameMenuWidth = gameMenuRect.width;
    const windowHeight = window.innerHeight;

    const canvasWidth = windowWidth - gameMenuWidth - 30;
    const canvasHeight = windowHeight;

    CANVAS.width = canvasWidth;
    CANVAS.height = canvasHeight;

    return {
        width: canvasWidth,
        height: canvasHeight,
    };
}

/**
 * Return the canvas dimensions (width/height).
 */
export function getCanvasDimensions() {
    return {
        width: CANVAS.width,
        height: CANVAS.height,
    };
}

/**
 * Get a previously loaded asset.
 */
export function getAsset(id: string) {
    return PRELOAD.getResult(id) as HTMLImageElement;
}
