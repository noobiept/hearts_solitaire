/// <reference path='cards.ts' />
/// <reference path='player.ts' />
/// <reference path='round.ts' />

module Game
{
var SOUTH: Player;  // human player
var NORTH: Player;
var EAST: Player;
var WEST: Player;

var PLAYERS: Player[] = [];

var ACTIVE_PLAYER: Player = null;

export enum Position { west, east, north, south }

export function start()
{
Cards.init();


SOUTH = new Player({
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

    // in clockwise order
PLAYERS.push( NORTH, EAST, SOUTH,  WEST );


    // determine who starts playing (who has the 2 of clubs)
for (var a = 0 ; a < PLAYERS.length ; a++)
    {
    if ( PLAYERS[ a ].hasCard( Cards.Suit.clubs, Cards.SuitSymbol.two ) )
        {
        ACTIVE_PLAYER = PLAYERS[ a ];
        }
    }


Round.start();
console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );

createjs.Ticker.on( 'tick', tick );
}


export function playCard( card: Cards.IndividualCard )
{
if ( card.player !== ACTIVE_PLAYER )
    {
    console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
    return false;
    }

console.log('card played by', Position[ card.player.position ]);

if ( Round.playCard( card ) )
    {
    var winner = Round.getWinner();

        // round ended
    if ( winner )
        {
            // the player that has won will start the next round
        ACTIVE_PLAYER = winner;
        }

        // round still going on, go to next player
    else
        {
            // give turn to next player
        var index = PLAYERS.indexOf( ACTIVE_PLAYER );

        index++;

        if ( index >= PLAYERS.length )
            {
            index = 0;
            }

        ACTIVE_PLAYER = PLAYERS[ index ];
        }

    return true;
    }

else
    {
    console.log('invalid card.');
    return false;
    }
}






export function tick()
{
G.STAGE.update();
}



}