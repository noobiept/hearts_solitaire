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

Round.clearRound();
startRound();

createjs.Ticker.on( 'tick', tick );
}


export function startRound()
{
var a = 0;

for (a = 0 ; a < PLAYERS.length ; a++)
    {
    PLAYERS[ a ].getHand();
    }

    // determine who starts playing (who has the 2 of clubs)
for (var a = 0 ; a < PLAYERS.length ; a++)
    {
    if ( PLAYERS[ a ].hasCard( Cards.Suit.clubs, Cards.SuitSymbol.two ) )
        {
        ACTIVE_PLAYER = PLAYERS[ a ];
        break;
        }
    }

console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
}


export function playCard( card: Cards.IndividualCard )
{
var player = card.player;

if ( player !== ACTIVE_PLAYER )
    {
    console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
    return false;
    }

console.log( 'card played by', Position[ player.position ] );

if ( Round.playCard( card ) )
    {
    player.removeCard( card );

    var winner = Round.getWinner();

        // turn ended
    if ( winner )
        {
        winner.player.addPoints( winner.points );   //HERE should only update the points at the end of the round (since there's the chance of one player getting all the points)

            // the player that has won will start the next turn
        ACTIVE_PLAYER = winner.player;


            // check if the round has ended (when there's no more cards to be played)
            // we can check in any player (since they all have the same amount of cards)
        if ( ACTIVE_PLAYER.cardCount() === 0 )
            {
                // round ended
                // update the points //HERE
                // start new round
            Round.clearRound();
            startRound();
            }
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
    }

else
    {
    console.log('invalid card.');
    }
}






export function tick()
{
G.STAGE.update();
}



}