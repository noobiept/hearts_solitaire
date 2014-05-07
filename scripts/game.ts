/// <reference path='cards.ts' />
/// <reference path='player.ts' />
/// <reference path='round.ts' />

module Game
{
var HUMAN: Player;  // south
var NORTH: Player;
var EAST: Player;
var WEST: Player;


var ACTIVE_PLAYER = null;

export enum Position { west, east, north, south }

export function start()
{
Cards.init();


HUMAN = new Player({
        show: true,
        position: Position.south
    });

NORTH = new Player({
        show: true,     // for now show for debugging //HERE
        position: Position.north
    });

EAST = new Player({
        show: true,
        position: Position.east
    });

WEST = new Player({
        show: true,
        position: Position.west
    });



    // determine who starts playing (who has the 2 of clubs)
var players = [ HUMAN, NORTH, EAST, WEST ];

for (var a = 0 ; a < players.length ; a++)
    {
    if ( players[ a ].hasCard( Cards.Suit.clubs, Cards.SuitSymbol.two ) )
        {
        ACTIVE_PLAYER = players[ a ];
        }
    }

console.log(ACTIVE_PLAYER);

createjs.Ticker.on( 'tick', tick );
}


export function playCard( card: Cards.IndividualCard )
{
console.log('card played by', Position[ card.player.position ]);

Round.cardPlayed( card );
}



export function tick()
{
G.STAGE.update();
}



}