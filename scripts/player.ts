/// <reference path='cards.ts' />

interface PlayerArgs
    {
    show: Boolean;  // show or hide the cards
    position: Game.Position;
    }

class Player
{
    cards: {
        clubs: Cards.IndividualCard[];
        diamonds: Cards.IndividualCard[];
        spades: Cards.IndividualCard[];
        hearts: Cards.IndividualCard[];
    };

    static startingCards = 13;
    cardsCount: number;

        // these are used for the positioning
    centerX: number;
    centerY: number;
    horizontalOrientation: boolean;
    static step = 40;
    position: Game.Position;

    points: number;


    constructor( args: PlayerArgs )
        {
        this.cardsCount = 0;
        this.position = args.position;
        this.cards = { clubs: null, diamonds: null, spades: null, hearts: null };
        this.points = 0;
        }

    getHand()
        {
        var cards = [];

        for (var a = 0 ; a < Player.startingCards ; a++)
            {
            var card = Cards.getRandom();

            card.show();
            card.setPlayer( this );

            cards.push( card );
            }

        this.cardsCount = Player.startingCards;

        this.cards.clubs = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.clubs;
            });
        this.cards.diamonds = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.diamonds;
            });
        this.cards.spades = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.spades;
            });
        this.cards.hearts = cards.filter(function( element )
            {
            return element.suit == Cards.Suit.hearts;
            });


            // order the cards by the symbol
        var sortSymbol = function(a, b)
            {
            return a.suitSymbol - b.suitSymbol;
            };

        this.cards.clubs.sort( sortSymbol );
        this.cards.diamonds.sort( sortSymbol );
        this.cards.spades.sort( sortSymbol );
        this.cards.hearts.sort( sortSymbol );

        var width = G.CANVAS.width;
        var height = G.CANVAS.height;

        if ( this.position == Game.Position.south )
            {
            this.centerX = width / 2;
            this.centerY = height - Cards.IndividualCard.height;
            this.horizontalOrientation = true;
            }

        else if ( this.position == Game.Position.north )
            {
            this.centerX = width / 2;
            this.centerY = 0;
            this.horizontalOrientation = true;
            }

        else if ( this.position == Game.Position.east )
            {
            this.centerX = width - Cards.IndividualCard.width;
            this.centerY = height / 2;
            this.horizontalOrientation = false;
            }

        else if ( this.position == Game.Position.west )
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


        for (var a = 0 ; a < this.cards.clubs.length ; a++)
            {
            this.cards.clubs[ a ].show();
            this.cards.clubs[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.diamonds.length ; a++)
            {
            this.cards.diamonds[ a ].show();
            this.cards.diamonds[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.spades.length ; a++)
            {
            this.cards.spades[ a ].show();
            this.cards.spades[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.hearts.length ; a++)
            {
            this.cards.hearts[ a ].show();
            this.cards.hearts[ a ].setPosition( x, y );

            x += stepX;
            y += stepY;
            }
        }

    hasCard( suit: Cards.Suit, symbol: Cards.SuitSymbol )
        {
        var array: Cards.IndividualCard[] = this.cards[ Cards.Suit[ suit ] ];

        for (var a = 0 ; a < array.length ; a++)
            {
            if ( array[ a ].suitSymbol == symbol )
                {
                return true;
                }
            }

        return false;
        }

    cardCount()
        {
        return this.cardsCount;
        }

    removeCard( card: Cards.IndividualCard )
        {
        var array = this.cards[ Cards.Suit[ card.suit ] ];

        var index = array.indexOf( card );

        array.splice( index, 1 );

        this.cardsCount--;
        }


    addPoints( points )
        {
        this.points += points;
        }

    getPoints()
        {
        return this.points;
        }
}