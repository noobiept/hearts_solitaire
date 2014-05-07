/// <reference path='cards.ts' />
/// <reference path='player.ts' />

module Round
{
    // cards played in the round
var CARDS = [];


export function cardPlayed( card: Cards.IndividualCard )
{
CARDS.push( card );

var x = G.CANVAS.width / 2;
var y = G.CANVAS.height / 2;
var position = card.player.position;

var offset = 40;

if ( position == Game.Position.west )
    {
    x -= offset;
    }

else if ( position == Game.Position.east )
    {
    x += offset;
    }

else if ( position == Game.Position.north )
    {
    y -= offset;
    }

else if ( position == Game.Position.south )
    {
    y += offset;
    }

else
    {
    console.log( 'error, wrong orientation argument.' );
    return;
    }


card.moveTo( x, y );
}




}