import { Pass, passCards, addToStage } from "./game.js";
import { getAsset, getCanvasDimensions } from "./main.js";

var ELEMENT: createjs.Bitmap;
var IMAGES = {};
var CURRENT_DIRECTION: Pass;

export function init() {
    const canvas = getCanvasDimensions();

    IMAGES[Pass.left] = getAsset("pass_left");
    IMAGES[Pass.left + "_effect"] = getAsset("pass_left_effect");

    IMAGES[Pass.right] = getAsset("pass_right");
    IMAGES[Pass.right + "_effect"] = getAsset("pass_right_effect");

    IMAGES[Pass.across] = getAsset("pass_across");
    IMAGES[Pass.across + "_effect"] = getAsset("pass_across_effect");

    CURRENT_DIRECTION = Pass.left;
    ELEMENT = new createjs.Bitmap(IMAGES[CURRENT_DIRECTION]);
    ELEMENT.visible = false;
    ELEMENT.filters = [];
    ELEMENT.on("click", passCards);
    ELEMENT.x = canvas.width / 2;
    ELEMENT.y = canvas.height / 2;

    addToStage(ELEMENT);
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
