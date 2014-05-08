/// <reference path='cards.ts' />
/// <reference path='player.ts' />

module Round
{
var IS_FIRST_TURN: boolean;
var IS_HEARTS_BROKEN: boolean;


    // cards played in the current turn
var CARDS = [];

    // lead card in the current turn
var LEAD_CARD: Cards.IndividualCard;


export function start()
{
LEAD_CARD = null;

IS_FIRST_TURN = true;
IS_HEARTS_BROKEN = false;
}



function isValidMove( card: Cards.IndividualCard )
{
var player = card.player;

    // first play of the turn
if ( LEAD_CARD === null )
    {
        // need to play the 2 of clubs
    if ( IS_FIRST_TURN )
        {
        if ( card.suit == Cards.Suit.clubs && card.suitSymbol == Cards.SuitSymbol.two )
            {
            return true;
            }

        else
            {
            console.log( 'Need to play the 2 of clubs' );
            return false;
            }
        }

        // the hearts can only be played if its already broken (or if you only have hearts left)
        // otherwise any card can be played
    else
        {
        if ( card.suit == Cards.Suit.hearts )
            {
            if ( !IS_HEARTS_BROKEN )
                {
                    // check if you only have hearts left
                if ( player.cards.hearts.length == player.cardsCount )
                    {
                    return true;
                    }

                else
                    {
                    return false;
                    }
                }
            }

        return true;
        }
    }

else
    {
    var leadSuit = LEAD_CARD.suit;

    if ( card.suit == leadSuit )
        {
        return true;
        }

        // you can only play a different suit if you don't have cards of the lead suit
    else
        {
        if ( player.cards[ Cards.Suit[ leadSuit ] ].length == 0 )
            {
            return true;
            }

        else
            {
            return false;
            }
        }
    }
}

/*
    Returns true if the card was played, or false if its an invalid play
 */

export function playCard( card: Cards.IndividualCard )
{
if ( !isValidMove( card ) )
    {
    console.log( 'invalid card' );
    return false;
    }

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

if ( LEAD_CARD === null )
    {
    LEAD_CARD = card;
    }

CARDS.push( card );

return true;
}

/*
    Returns null if the round hasn't ended, otherwise returns a reference to the player that won
 */

export function getWinner()
{
    // all players played a card, need to determine who won the round
if ( CARDS.length >= 4 )
    {
    return determineWinner();
    }

return null;
}




export function determineWinner()
{
return CARDS[ 0 ].player;   //HERE
}



}