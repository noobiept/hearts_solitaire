/// <reference path='utilities.ts' />

module MoveAnimation
{
var ACTIVE = [];

export function init()
{
createjs.Ticker.on( 'tick', MoveAnimation.tick );
}

export class Move
    {
    duration: number;
    count: number;
    element: createjs.DisplayObject;
    moveX: number;
    moveY: number;
    destX: number;
    destY: number;
    callback: () => any;
    isMoving: boolean;

    constructor( element: createjs.DisplayObject )
        {
        this.count = 0;
        this.duration = 0;
        this.element = element;
        this.moveX = 0;
        this.moveY = 0;
        this.callback = null;
        this.isMoving = false;
        }

    start( destX: number, destY: number, duration: number, callback: () => any )
        {
        this.isMoving = true;
        var currentX = this.element.x;
        var currentY = this.element.y;

        var angleRads = calculateAngle( currentX, currentY * -1, destX, destY * -1 );

        var distance = calculateHypotenuse( currentX, currentY * -1, destX, destY * -1 );
        var movementSpeed = distance / duration;

        this.moveX = Math.cos( angleRads ) * movementSpeed;
        this.moveY = Math.sin( angleRads ) * movementSpeed;

        this.duration = duration;
        this.destX = destX;
        this.destY = destY;
        this.count = 0;

        if ( callback )
            {
            this.callback = callback;
            }

        else
            {
            this.callback = null;
            }

        ACTIVE.push( this );
        }

    end()
        {
        if ( !this.isMoving )
            {
            return;
            }

        this.isMoving = false;
        this.element.x = this.destX;
        this.element.y = this.destY;

        var index = ACTIVE.indexOf( this );

        ACTIVE.splice( index, 1 );

        if ( this.callback )
            {
            this.callback();
            }
        }

    tick( event )
        {
        this.count += event.delta;

        if ( this.count >= this.duration )
            {
            this.end();
            }

        else
            {
            this.element.x += this.moveX * event.delta;
            this.element.y += this.moveY * event.delta;
            }
        }
    }


export function tick( event )
{
for (var a = ACTIVE.length - 1 ; a >= 0 ; a--)
    {
    ACTIVE[ a ].tick( event );
    }
}


}

