/// <reference path='cards.ts' />
/// <reference path='hand.ts' />

module Game
{
export var HAND;

export function start()
{
Cards.init();

HAND = new Hand({
        show: true,
        position: GamePosition.bottom
    });

createjs.Ticker.on( 'tick', tick );
}



export function tick()
{
G.STAGE.update();
}



}