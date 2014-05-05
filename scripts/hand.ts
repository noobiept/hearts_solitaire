/// <reference path='cards.ts' />

enum GamePosition { left, right, top, bottom }

interface HandArgs
    {
    show: Boolean;  // show or hide the cards
    position: GamePosition
    }

class Hand
{
    clubs: Cards.IndividualCard[];
    diamonds: Cards.IndividualCard[];
    spades: Cards.IndividualCard[];
    hearts: Cards.IndividualCard[];

    constructor( args: HandArgs )
        {
        var startingCards = 13;

        var cards = [];

        for (var a = 0 ; a < startingCards ; a++)
            {
            cards.push( Cards.getRandom() );
            }

        this.clubs = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.clubs;
            });
        this.diamonds = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.diamonds;
            });
        this.spades = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.spades;
            });
        this.hearts = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.hearts;
            });


            // order the cards by the symbol
        var sortSymbol = function(a, b)
            {
            return a.suitSymbol - b.suitSymbol;
            };

        this.clubs.sort( sortSymbol );
        this.diamonds.sort( sortSymbol );
        this.spades.sort( sortSymbol );
        this.hearts.sort( sortSymbol );

        var x = 0;
        var y = 10;
        var step = 40;

        for (var a = 0 ; a < this.clubs.length ; a++)
            {
            this.clubs[ a ].show();
            this.clubs[ a ].moveTo( x, y );

            x += step;
            }
        for (var a = 0 ; a < this.diamonds.length ; a++)
            {
            this.diamonds[ a ].show();
            this.diamonds[ a ].moveTo( x, y );

            x += step;
            }
        for (var a = 0 ; a < this.spades.length ; a++)
            {
            this.spades[ a ].show();
            this.spades[ a ].moveTo( x, y );

            x += step;
            }
        for (var a = 0 ; a < this.hearts.length ; a++)
            {
            this.hearts[ a ].show();
            this.hearts[ a ].moveTo( x, y );

            x += step;
            }
        }
}