/// <reference path='cards.ts' />
/// <reference path='player.ts' />
/// <reference path='round.ts' />
/// <reference path='game_menu.ts' />

module Game
{
export enum Position { south, west, north, east }

var PLAYERS = {
    south: <Player> null,  // human player
    west: <Player> null,
    north: <Player> null,
    east: <Player> null
};

    // in the play order (clock-wise)
var PLAYERS_POSITION = [ 'south', 'west', 'north', 'east' ];


var ACTIVE_PLAYER: Player = null;



export function start()
{
Cards.init();


PLAYERS.south = new Player({
        show: true,
        position: Position.south
    });

PLAYERS.north = new Player({
        show: true,     // for now show for debugging //HERE
        position: Position.north
    });

PLAYERS.east = new Player({
        show: true,
        position: Position.east
    });

PLAYERS.west = new Player({
        show: true,
        position: Position.west
    });


GameMenu.init();
GameMenu.updateScores();
Round.clearRound();
startRound();

createjs.Ticker.on( 'tick', tick );
}


export function startRound()
{
var a;
var player;
var position;

for (a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    position = PLAYERS_POSITION[ a ];

    player = PLAYERS[ position ];

    player.getHand();
    }

    // determine who starts playing (who has the 2 of clubs)
for (a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    position = PLAYERS_POSITION[ a ];
    player = PLAYERS[ position ];

    if ( player.hasCard( Cards.Suit.clubs, Cards.SuitSymbol.two ) )
        {
        ACTIVE_PLAYER = player;
        break;
        }
    }

console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
}

export function isValidMove( card: Cards.IndividualCard )
{
if ( Cards.isMoving() )
    {
    return false;
    }

var player = card.player;

if ( player !== ACTIVE_PLAYER )
    {
    console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
    return false;
    }

console.log( 'card played by', Position[ player.position ] );

return Round.isValidMove( card );
}


export function cardPlayed( card: Cards.IndividualCard )
{
var player = card.player;

player.removeCard( card );

var winner = Round.getTurnWinner();

    // turn ended
if ( winner )
    {
        // the player that has won will start the next turn
    ACTIVE_PLAYER = winner;


        // check if the round has ended (when there's no more cards to be played)
        // we can check in any player (since they all have the same amount of cards)
    if ( ACTIVE_PLAYER.cardCount() === 0 )
        {
            // round ended
            // update the points
        updatePoints();

            // start new round
        Round.clearRound();
        startRound();
        }
    }

    // round still going on, go to next player
else
    {
        // give turn to next player
    var index = ACTIVE_PLAYER.position;

    index++;

    if ( index >= PLAYERS_POSITION.length )
        {
        index = 0;
        }

    ACTIVE_PLAYER = PLAYERS[ Position[ index ] ];
    }
}


function updatePoints()
{
var points = Round.getPoints();

for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    var position = PLAYERS_POSITION[ a ];

    var player = PLAYERS[ position ];

    player.addPoints( points[ position ] );
    }

GameMenu.updateScores();
}


export function getPlayer( position: Position )
{
return PLAYERS[ Position[ position ] ];
}


export function restart()
{
clear();
start();
}


function clear()
{

}


export function tick()
{
G.STAGE.update();
}



}