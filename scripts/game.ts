/// <reference path='cards.ts' />
/// <reference path='hand.ts' />
/// <reference path='player.ts' />

module Game
{
var HUMAN: Player;  // south
var NORTH: Player;
var EAST: Player;
var WEST: Player;


export function start()
{
Cards.init();


HUMAN = new Player({
        show: true,
        position: GamePosition.south
    });

NORTH = new Player({
        show: true,     // for now show for debugging //HERE
        position: GamePosition.north
    });

EAST = new Player({
        show: true,
        position: GamePosition.east
    });

WEST = new Player({
        show: true,
        position: GamePosition.west
    });


createjs.Ticker.on( 'tick', tick );
}



export function tick()
{
G.STAGE.update();
}



}