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

var POINTS = {
        south: 0,
        west: 0,
        north: 0,
        east: 0
    };



export function isValidMove( card: Cards.IndividualCard )
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
                if ( player.cards.hearts.length == player.cardCount() )
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
                // can't play the queen of spades or hearts on the first turn (unless you happen to have all 13 hearts cards)
            if ( IS_FIRST_TURN )
                {
                if ( card.suit == Cards.Suit.spades && card.suitSymbol == Cards.SuitSymbol.queen )
                    {
                    console.log( "Can't play the queen of spades on first turn." );
                    return false;
                    }

                else if ( card.suit == Cards.Suit.hearts && player.cards[ 'hearts' ].length < 13 )
                    {
                    console.log( "Can't play hearts on the first turn (unless you happen to have all 13 hearts cards." );
                    return false;
                    }

                else
                    {
                    return true;
                    }
                }

            else
                {
                return true;
                }
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
var x = G.CANVAS.width / 2 - Cards.IndividualCard.width / 2;
var y = G.CANVAS.height / 2 - Cards.IndividualCard.height / 2;
var position = card.player.position;

var offset = 70;

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


card.show();    // force the card to be shown in front of others
card.moveTo( x, y, 500, function() { Game.cardPlayed() } );

CARDS.push( card );


if ( LEAD_CARD === null )
    {
    LEAD_CARD = card;
    }

if ( card.suit === Cards.Suit.hearts )
    {
    IS_HEARTS_BROKEN = true;
    }
}

/*
    Returns null if the round hasn't ended, otherwise returns a reference to the player that won
 */

export function getTurnWinner()
{
    // all players played a card, need to determine who won the round
if ( CARDS.length >= 4 )
    {
        // a round was completed, so we can update this flag
    if ( IS_FIRST_TURN )
        {
        IS_FIRST_TURN = false;
        }

    var winner = determineWinner();

    for (var a = 0 ; a < CARDS.length ; a++)
        {
        CARDS[ a ].moveAndHide( winner.centerX, winner.centerY, 500 );
        }

    clearTurn();

    return winner;
    }

return null;
}





function determineWinner()
{
    // get all cards of the suit of the lead
var suit = LEAD_CARD.suit;

var cards = [];
var a;

for (a = 0 ; a < CARDS.length ; a++)
    {
    if ( CARDS[ a ].suit === suit )
        {
        cards.push( CARDS[ a ] );
        }
    }


    // determine the card with highest symbol (will be the winner)
var highest = cards[ 0 ];

for (a = 1 ; a < cards.length ; a++)
    {
    if ( cards[ a ].suitSymbol > highest.suitSymbol )
        {
        highest = cards[ a ];
        }
    }

    // determine the points
    // 1 point per hearts card
    // 13 points for the queen of spades
var points = 0;

for (a = 0 ; a < CARDS.length ; a++)
    {
    var card = CARDS[ a ];

    if ( card.suit === Cards.Suit.hearts )
        {
        points++;
        }

    else if ( card.suit === Cards.Suit.spades && card.suitSymbol === Cards.SuitSymbol.queen )
        {
        points += 13;
        }
    }

var player = highest.player;
var position = Game.Position[ player.position ];

POINTS[ position ] += points;

return highest.player;
}

/*
    Called when the round ends
    Need to check if a player got all the hearts + queen of spades (if so, all the other players get 26 points)
    Otherwise the current points stays
 */

export function getPoints()
{
if ( POINTS.west >= 26 )
    {
    POINTS.west = 0;
    POINTS.north = 26;
    POINTS.east = 26;
    POINTS.south = 26;
    }

else if ( POINTS.north >= 26 )
    {
    POINTS.west = 26;
    POINTS.north = 0;
    POINTS.east = 26;
    POINTS.south = 26;
    }

else if ( POINTS.east >= 26 )
    {
    POINTS.west = 26;
    POINTS.north = 26;
    POINTS.east = 0;
    POINTS.south = 26;
    }

else if ( POINTS.south >= 26 )
    {
    POINTS.west = 26;
    POINTS.north = 26;
    POINTS.east = 26;
    POINTS.south = 0;
    }


return POINTS;
}


/*
    When a round ends, removes the cards and the lead card
 */

function clearTurn()
{
for (var a = 0 ; a < CARDS.length ; a++)
    {
    Cards.setAvailable( CARDS[ a ] );
    }

CARDS.length = 0;

LEAD_CARD = null;
}


/*
    For when restarting the game (clears everything)
 */

export function clearRound()
{
clearTurn();

POINTS.south = 0;
POINTS.west = 0;
POINTS.north = 0;
POINTS.east = 0;

IS_FIRST_TURN = true;
IS_HEARTS_BROKEN = false;
}


}