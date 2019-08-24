import { calculateAngle, calculateDistance } from "@drk4/utilities";

var ACTIVE: Move[] = [];

export function init() {
    createjs.Ticker.on("tick", tick as any);
}

export class Move {
    duration = 0;
    count = 0;
    element: createjs.DisplayObject;
    moveX = 0;
    moveY = 0;
    destX = 0;
    destY = 0;
    callback: (() => any) | null;
    isMoving: boolean;

    constructor(element: createjs.DisplayObject) {
        this.element = element;
        this.callback = null;
        this.isMoving = false;
    }

    start(destX: number, destY: number, duration: number, callback: () => any) {
        this.isMoving = true;
        var currentX = this.element.x;
        var currentY = this.element.y;

        var angleRads = calculateAngle(
            currentX,
            currentY * -1,
            destX,
            destY * -1
        );

        var distance = calculateDistance(
            currentX,
            currentY * -1,
            destX,
            destY * -1
        );
        var movementSpeed = distance / duration;

        this.moveX = Math.cos(angleRads) * movementSpeed;
        this.moveY = Math.sin(angleRads) * movementSpeed;

        this.duration = duration;
        this.destX = destX;
        this.destY = destY;
        this.count = 0;

        if (callback) {
            this.callback = callback;
        } else {
            this.callback = null;
        }

        ACTIVE.push(this);
    }

    end() {
        if (!this.isMoving) {
            return;
        }

        this.isMoving = false;
        this.element.x = this.destX;
        this.element.y = this.destY;

        var index = ACTIVE.indexOf(this);

        ACTIVE.splice(index, 1);

        if (this.callback) {
            this.callback();
        }
    }

    clear() {
        this.isMoving = false;

        var index = ACTIVE.indexOf(this);
        ACTIVE.splice(index, 1);
    }

    tick(event: createjs.TickerEvent) {
        this.count += event.delta;

        if (this.count >= this.duration) {
            this.end();
        } else {
            this.element.x += this.moveX * event.delta;
            this.element.y += this.moveY * event.delta;
        }
    }
}

export function tick(event: createjs.TickerEvent) {
    for (var a = ACTIVE.length - 1; a >= 0; a--) {
        ACTIVE[a].tick(event);
    }
}
