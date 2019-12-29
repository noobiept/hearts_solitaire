import { calculateAngle, calculateDistance } from "@drk4/utilities";

var ACTIVE: Move[] = [];

export function init() {
    createjs.Ticker.on("tick", tick as any);
}

export class Move {
    private duration = 0;
    private count = 0;
    private element: createjs.DisplayObject;
    private moveX = 0;
    private moveY = 0;
    private destX = 0;
    private destY = 0;
    private callback: (() => any) | null;
    private moving: boolean;

    constructor(element: createjs.DisplayObject) {
        this.element = element;
        this.callback = null;
        this.moving = false;
    }

    start(destX: number, destY: number, duration: number, callback: () => any) {
        if (this.moving) {
            this.clear();
        }

        this.moving = true;
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
        if (!this.moving) {
            return;
        }

        this.moving = false;
        this.element.x = this.destX;
        this.element.y = this.destY;

        var index = ACTIVE.indexOf(this);

        ACTIVE.splice(index, 1);

        if (this.callback) {
            this.callback();
        }
    }

    clear() {
        this.moving = false;

        var index = ACTIVE.indexOf(this);
        ACTIVE.splice(index, 1);
    }

    isMoving() {
        return this.moving;
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
