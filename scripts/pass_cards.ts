import { Pass, passCards } from "./game.js";
import { G } from "./main.js";

var ELEMENT: createjs.Bitmap;
var IMAGES = {};
var CURRENT_DIRECTION: Pass;

export function init() {
    IMAGES[Pass.left] = <HTMLImageElement>G.PRELOAD.getResult("pass_left");
    IMAGES[Pass.left + "_effect"] = <HTMLImageElement>(
        G.PRELOAD.getResult("pass_left_effect")
    );
    IMAGES[Pass.right] = <HTMLImageElement>G.PRELOAD.getResult("pass_right");
    IMAGES[Pass.right + "_effect"] = <HTMLImageElement>(
        G.PRELOAD.getResult("pass_right_effect")
    );
    IMAGES[Pass.across] = <HTMLImageElement>G.PRELOAD.getResult("pass_across");
    IMAGES[Pass.across + "_effect"] = <HTMLImageElement>(
        G.PRELOAD.getResult("pass_across_effect")
    );

    CURRENT_DIRECTION = Pass.left;
    ELEMENT = new createjs.Bitmap(IMAGES[CURRENT_DIRECTION]);
    ELEMENT.visible = false;
    ELEMENT.filters = [];
    ELEMENT.on("click", passCards);
    ELEMENT.x = G.CANVAS.width / 2;
    ELEMENT.y = G.CANVAS.height / 2;

    G.STAGE.addChild(ELEMENT);
}

export function setPosition(x: number, y: number) {
    ELEMENT.x = x;
    ELEMENT.y = y;
}

export function show() {
    ELEMENT.visible = true;
}

export function hide() {
    ELEMENT.visible = false;
}

export function select(direction: Pass) {
    CURRENT_DIRECTION = direction;
    ELEMENT.image = IMAGES[direction];
    show();
}

export function addEffect() {
    ELEMENT.image = IMAGES[CURRENT_DIRECTION + "_effect"];
}

export function removeEffect() {
    ELEMENT.image = IMAGES[CURRENT_DIRECTION];
}
