/// <reference path='game.ts' />

/*
    current player points
    restart the game
 */

module GameMenu
{
    // scores for the 4 players, has the html reference
var SCORES = {
        south: null,
        west : null,
        north: null,
        east : null
    };

export function init()
{
var menu = document.querySelector( '#GameMenu' );


SCORES[ 'south' ] = menu.querySelector( '#south' );
SCORES[ 'west'  ] = menu.querySelector( '#west' );
SCORES[ 'north' ] = menu.querySelector( '#north' );
SCORES[ 'east'  ] = menu.querySelector( '#east' );

var restart = <HTMLDivElement> menu.querySelector( '#Restart' );

restart.onclick = Game.restart;
}


export function updateScores()
{
var positions = [ 'south', 'west', 'north', 'east' ];

for (var a = 0 ; a < positions.length ; a++)
    {
    var position = positions[ a ];
    var player = Game.getPlayer( Game.Position[ position ] );

    $( SCORES[ position ] ).text( player.getPoints() );
    }
}


}