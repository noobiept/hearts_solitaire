import { Pass, passCards, addToStage } from "./game.js";
import { getAsset, getCanvasDimensions } from "./main.js";

export type ImagesData = {
    [key in Pass]: {
        default: HTMLImageElement;
        effect: HTMLImageElement;
    };
};

var ELEMENT: createjs.Bitmap;
var IMAGES: ImagesData;
var CURRENT_DIRECTION: Pass;

export function init() {
    const canvas = getCanvasDimensions();

    IMAGES = {
        left: {
            default: getAsset("pass_left"),
            effect: getAsset("pass_left_effect"),
        },
        right: {
            default: getAsset("pass_right"),
            effect: getAsset("pass_right_effect"),
        },
        across: {
            default: getAsset("pass_across"),
            effect: getAsset("pass_across_effect"),
        },
    };

    CURRENT_DIRECTION = "left";
    ELEMENT = new createjs.Bitmap(IMAGES[CURRENT_DIRECTION].default);
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
    ELEMENT.image = IMAGES[direction].default;
    show();
}

export function addEffect() {
    ELEMENT.image = IMAGES[CURRENT_DIRECTION].effect;
}

export function removeEffect() {
    ELEMENT.image = IMAGES[CURRENT_DIRECTION].default;
}
