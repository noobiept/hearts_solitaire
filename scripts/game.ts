/// <reference path='cards.ts' />
/// <reference path='player.ts' />
/// <reference path='bot.ts' />
/// <reference path='round.ts' />
/// <reference path='game_menu.ts' />
/// <reference path='move_animation.ts' />

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
var PASS_CARDS_PHASE: boolean;
var PASS_CARDS_ELEMENT: createjs.Bitmap;

enum Pass { left, right, across }

var PASS_CARDS = Pass.left;

    // wait until the card animations end, until we play other cards
var PLAY_QUEUE: Cards.IndividualCard[] = [];


export function start()
{
Cards.init();
MoveAnimation.init();

PASS_CARDS_ELEMENT = new createjs.Bitmap( G.PRELOAD.getResult( 'pass_left' ) );
PASS_CARDS_ELEMENT.visible = false;
PASS_CARDS_ELEMENT.x = G.CANVAS.width / 2;
PASS_CARDS_ELEMENT.y = G.CANVAS.height / 2;
PASS_CARDS_ELEMENT.on( 'click', Game.passCards );

G.STAGE.addChild( PASS_CARDS_ELEMENT );

PLAYERS.south = new Player({
        show: true,
        position: Position.south
    });

PLAYERS.north = new Bot({
        show: true,     // for now show for debugging //HERE
        position: Position.north
    });

PLAYERS.east = new Bot({
        show: true,
        position: Position.east
    });

PLAYERS.west = new Bot({
        show: true,
        position: Position.west
    });


GameMenu.init();
GameMenu.updateScores();
Round.clearRound();

createjs.Ticker.on( 'tick', tick );

    // called when you press the right button of the mouse
    // disable the context menu
    // force the cards to move immediately to destination
G.CANVAS.oncontextmenu = function( event )
    {
        // right click
    if ( event.button == 2 )
        {
        Cards.forceMoveToDestination();
        }

     return false;
    };


drawCards();
}


export function drawCards()
{
var player;
var position;

for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    position = PLAYERS_POSITION[ a ];

    player = PLAYERS[ position ];

    player.getHand();
    }

PASS_CARDS_PHASE = true;

for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    PLAYERS[ PLAYERS_POSITION[ a ] ].yourTurn();
    }


var pass = Pass[ PASS_CARDS ];

PASS_CARDS_ELEMENT.image = G.PRELOAD.getResult( 'pass_' + pass );
PASS_CARDS_ELEMENT.visible = true;
}


export function passCards()
{
for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    var player = PLAYERS[ PLAYERS_POSITION[ a ] ];

    if ( player.selectedCards.length < 3 )
        {
        console.log( "Need to select 3 cards to pass." );
        return;
        }
    }


var pass = function( from, to )
    {
    var cards = PLAYERS[ from ].removeSelectedCards();

    for (a = 0 ; a < cards.length ; a++)
        {
        PLAYERS[ to ].addCard( cards[ a ] );
        }
    };


    // clockwise order
if ( PASS_CARDS == Pass.left )
    {
    pass( 'south', 'west' );
    pass( 'west', 'north' );
    pass( 'north', 'east' );
    pass( 'east', 'south' );
    }

    // anti-clockwise order
else if ( PASS_CARDS == Pass.right )
    {
    pass( 'south', 'east' );
    pass( 'east', 'north' );
    pass( 'north', 'west' );
    pass( 'west', 'south' );
    }

else if ( PASS_CARDS == Pass.across )
    {
    pass( 'south', 'north' );
    pass( 'north', 'south' );
    pass( 'east', 'west' );
    pass( 'west', 'east' );
    }

else
    {
    console.log( 'Wrong value in PASS_CARDS.' );
    return;
    }


for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    PLAYERS[ PLAYERS_POSITION[ a ] ].positionCards( 400 );
    }


PASS_CARDS_PHASE = false;
PASS_CARDS++;
if ( PASS_CARDS >= 3 )  // its either left, right or across
    {
    PASS_CARDS = 0;
    }

PASS_CARDS_ELEMENT.visible = false;

startRound();
}




export function startRound()
{
var player;
var position;

    // determine who starts playing (who has the 2 of clubs)
for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    position = PLAYERS_POSITION[ a ];
    player = PLAYERS[ position ];

    if ( player.hasCard( Cards.Suit.clubs, Cards.SuitSymbol.two ) )
        {
        ACTIVE_PLAYER = player;
        break;
        }
    }

ACTIVE_PLAYER.yourTurn();

console.log( 'Its ' + Position[ ACTIVE_PLAYER.position ] + ' turn' );
}


export function isValidMove( card: Cards.IndividualCard )
{
if ( PASS_CARDS_PHASE )
    {
    return true;
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


export function addCardPlayQueue( card: Cards.IndividualCard )
{
PLAY_QUEUE.push( card );
}


export function playCard( card: Cards.IndividualCard )
{
var player = card.player;

if ( PASS_CARDS_PHASE )
    {
    player.selectCard( card );
    }

else
    {
    Round.playCard( card );
    player.removeCard( card );
    player.positionCards( 150 );
    }
}



export function cardPlayed()
{
var winner = Round.getTurnWinner();

    // turn ended
if ( winner )
    {
        // the player that has won will start the next turn
    ACTIVE_PLAYER = winner;
    ACTIVE_PLAYER.yourTurn();

        // check if the round has ended (when there's no more cards to be played)
        // we can check in any player (since they all have the same amount of cards)
    if ( ACTIVE_PLAYER.cardCount() === 0 )
        {
            // round ended
            // update the points
        var gameEnded = updatePoints();
        var roundEnded = document.querySelector( '#RoundEnded' );

        var message = '';

        if ( gameEnded )
            {
            message += 'Game Ended!<br />';

            var winners = getPlayersWinning();

            for (var a = 0 ; a < winners.length ; a++)
                {
                message += Position[ winners[ a ].position ] + ' Won!<br />';
                }
            }

        for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
            {
            var aPlayer = PLAYERS[ PLAYERS_POSITION[ a ] ];

            message += Position[ aPlayer.position ] + ': ' + aPlayer.getPoints() + '<br />';
            }

        $( roundEnded ).html( message );
        $( roundEnded ).dialog({
                modal: true,
                buttons: {
                    Ok: function()
                        {
                        $( this ).dialog( 'close' );

                        if ( gameEnded )
                            {
                            restart();
                            }

                        else
                            {
                                // start new round
                            Cards.centerCards();
                            Round.clearRound();
                            drawCards();
                            }
                        }
                }
            });
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
    ACTIVE_PLAYER.yourTurn();
    }
}


function updatePoints()
{
var points = Round.getPoints();
var gameEnded = false;

for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    var position = PLAYERS_POSITION[ a ];

    var player = PLAYERS[ position ];

    player.addPoints( points[ position ] );

    if ( player.getPoints() > 100 )
        {
        gameEnded = true;
        }
    }

GameMenu.updateScores();

return gameEnded;
}

/*
    Returns an array with the players who are currently winning (those who have less points)
    There's at least one player, but can be more (2 max. ?..)
 */
function getPlayersWinning()
{
var position = PLAYERS_POSITION[ 0 ];
var playersWinning = [ PLAYERS[ position ] ];

for (var a = 1 ; a < PLAYERS_POSITION.length ; a++)
    {
    position = PLAYERS_POSITION[ a ];
    var player = PLAYERS[ position ];
    var playerPoints = player.getPoints();
    var winningPoints = playersWinning[ 0 ].getPoints();

    if ( playerPoints < winningPoints )
        {
        playersWinning = [ player ];
        }

    else if ( playerPoints == winningPoints )
        {
        playersWinning.push( player );
        }
    }

return playersWinning
}


export function getPlayer( position: Position )
{
return PLAYERS[ Position[ position ] ];
}


export function restart()
{
for (var a = 0 ; a < PLAYERS_POSITION.length ; a++)
    {
    var player = PLAYERS[ PLAYERS_POSITION[ a ] ];

    player.clear();
    }

GameMenu.updateScores();

    // start new round
Cards.centerCards();
Round.clearRound();
drawCards();
}





export function isPassCardsPhase()
{
return PASS_CARDS_PHASE;
}



export function tick()
{
    // play a new card only when there's no card moving
if ( !Cards.isMoving() )
    {
    while ( PLAY_QUEUE.length > 0 )
        {
        var card = PLAY_QUEUE.pop();

        if ( Game.isValidMove( card ) )
            {
            Game.playCard( card );
            }
        }
    }

G.STAGE.update();
}



}
