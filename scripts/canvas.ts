export interface CanvasDimensions {
    width: number;
    height: number;
}

let CANVAS: HTMLCanvasElement;

export function init() {
    CANVAS = document.getElementById("MainCanvas") as HTMLCanvasElement;
}

export function getCanvasElement() {
    return CANVAS;
}

/**
 * Resize the canvas to fit the available window width/height.
 */
export function resizeCanvas() {
    const gameMenu = document.getElementById("GameMenu")!;
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
