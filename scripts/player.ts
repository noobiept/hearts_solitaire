/// <reference path='cards.ts' />

interface PlayerArgs
    {
    show: Boolean;  // show or hide the cards
    position: Game.Position;
    }

class Player
{
    clubs: Cards.IndividualCard[];
    diamonds: Cards.IndividualCard[];
    spades: Cards.IndividualCard[];
    hearts: Cards.IndividualCard[];

    cardsCount: number;

        // these are used for the positioning
    centerX: number;
    centerY: number;
    horizontalOrientation: boolean;
    static step = 40;
    position: Game.Position;


    constructor( args: PlayerArgs )
        {
        var startingCards = 13;

        this.cardsCount = startingCards;
        this.position = args.position;

        var cards = [];

        for (var a = 0 ; a < startingCards ; a++)
            {
            cards.push( Cards.getRandom( this ) );
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

        var width = G.CANVAS.width;
        var height = G.CANVAS.height;

        if ( args.position == Game.Position.south )
            {
            this.centerX = width / 2;
            this.centerY = height - Cards.IndividualCard.height;
            this.horizontalOrientation = true;
            }

        else if ( args.position == Game.Position.north )
            {
            this.centerX = width / 2;
            this.centerY = 0;
            this.horizontalOrientation = true;
            }

        else if ( args.position == Game.Position.east )
            {
            this.centerX = width - Cards.IndividualCard.width;
            this.centerY = height / 2;
            this.horizontalOrientation = false;
            }

        else if ( args.position == Game.Position.west )
            {
            this.centerX = 0;
            this.centerY = height / 2;
            this.horizontalOrientation = false;
            }

        else
            {
            console.log( 'error, wrong position argument' );
            return;
            }

        this.positionCards();
        }


    positionCards()
        {
        var x, y, stepX, stepY;

        if ( this.horizontalOrientation )
            {
            x = this.centerX - Math.round( this.cardsCount / 2 ) * Player.step;
            y = this.centerY;
            stepX = Player.step;
            stepY = 0;
            }

        else
            {
            x = this.centerX;
            y = this.centerY - Math.round( this.cardsCount / 2 ) * Player.step;
            stepX = 0;
            stepY = Player.step;
            }


        for (var a = 0 ; a < this.clubs.length ; a++)
            {
            this.clubs[ a ].show();
            this.clubs[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.diamonds.length ; a++)
            {
            this.diamonds[ a ].show();
            this.diamonds[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.spades.length ; a++)
            {
            this.spades[ a ].show();
            this.spades[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.hearts.length ; a++)
            {
            this.hearts[ a ].show();
            this.hearts[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        }
}