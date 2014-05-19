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
    selectedCards: Cards.IndividualCard[];

    points: number;


    constructor( args: PlayerArgs )
        {
        this.cardsCount = 0;
        this.position = args.position;
        this.cards = { clubs: null, diamonds: null, spades: null, hearts: null };
        this.points = 0;
        this.selectedCards = [];
        }

    getHand()
        {
        var cards = [];

        for (var a = 0 ; a < Player.startingCards ; a++)
            {
            var card = Cards.getRandom();

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

        this.positionCards( 700 );
        }


    positionCards( animationDuration )
        {
        var x, y, stepX, stepY;

        if ( this.horizontalOrientation )
            {
            x = this.centerX - ( this.cardsCount / 2 ) * Player.step;
            y = this.centerY;
            stepX = Player.step;
            stepY = 0;
            }

        else
            {
            x = this.centerX;
            y = this.centerY - ( this.cardsCount / 2 ) * Player.step;
            stepX = 0;
            stepY = Player.step;
            }


        for (var a = 0 ; a < this.cards.clubs.length ; a++)
            {
            this.cards.clubs[ a ].show();
            this.cards.clubs[ a ].moveTo( x, y, animationDuration );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.diamonds.length ; a++)
            {
            this.cards.diamonds[ a ].show();
            this.cards.diamonds[ a ].moveTo( x, y, animationDuration );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.spades.length ; a++)
            {
            this.cards.spades[ a ].show();
            this.cards.spades[ a ].moveTo( x, y, animationDuration );

            x += stepX;
            y += stepY;
            }
        for (var a = 0 ; a < this.cards.hearts.length ; a++)
            {
            this.cards.hearts[ a ].show();
            this.cards.hearts[ a ].moveTo( x, y, animationDuration );

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

    /*
        For the pass cards phase (where you pass 3 cards to other player)
     */

    selectCard( card: Cards.IndividualCard )
        {
        var _this = this;

            // moves the card slightly to the center (if positive offset)
        var moveCard = function( offset )
            {
            var x = card.getX();
            var y = card.getY();

            if ( _this.position == Game.Position.north )
                {
                y += offset;
                }

            else if ( _this.position == Game.Position.south )
                {
                y -= offset;
                }

            else if ( _this.position == Game.Position.west )
                {
                x += offset;
                }

            else if ( _this.position == Game.Position.east )
                {
                x -= offset;
                }

            else
                {
                console.log( 'error, wrong position argument' );
                return;
                }

            card.moveTo( x, y, 200 );
            };

        var offset = 40;

            // see if we're clicking on a already selected card (if so, we deselect it)
        var index = this.selectedCards.indexOf( card );
        if ( index > -1 )
            {
            this.selectedCards.splice( index, 1 );

                // move the card back to the original position
            moveCard( -offset );
            }

        else
            {
            if ( this.selectedCards.length >= 3 )
                {
                console.log( "Can't select more than 3 cards,." );
                return;
                }

            this.selectedCards.push( card );
            moveCard( offset );
            }
        }

    /*
        Removes the selected cards and returns an array with them
     */

    removeSelectedCards()
        {
        var cards = [];

        for (var a = 0 ; a < this.selectedCards.length ; a++)
            {
            var card = this.selectedCards[ a ];

            cards.push( this.removeCard( card ) );
            }

        this.selectedCards.length = 0;

        return cards;
        }


    cardCount()
        {
        return this.cardsCount;
        }

    addCard( card: Cards.IndividualCard )
        {
        var suit = Cards.Suit[ card.suit ];

        this.cards[ suit ].push( card );
        this.cards[ suit ].sort( function( a, b )
            {
            return a.suitSymbol - b.suitSymbol;
            });

        card.setPlayer( this );

        this.cardsCount++;
        }

    removeCard( card: Cards.IndividualCard )
        {
        var array = this.cards[ Cards.Suit[ card.suit ] ];

        var index = array.indexOf( card );

        var card = <Cards.IndividualCard> array.splice( index, 1 )[ 0 ];

        this.cardsCount--;

        return card;
        }

    clear()
        {
        this.points = 0;
        var suits = _.keys( this.cards );

        for (var a = 0 ; a < suits.length ; a++)
            {
            var cards = this.cards[ suits[ a ] ];

            for (var b = cards.length - 1 ; b >= 0 ; b--)
                {
                var card = cards[ b ];

                this.removeCard( card );
                Cards.setAvailable( card );
                }
            }
        }


    addPoints( points )
        {
        this.points += points;
        }


    getPoints()
        {
        return this.points;
        }

    yourTurn()
        {
            // called when its this player's turn to play
            // for the human player, this has nothing (card is played with the click event on the cards)
            // the bot player will decide what to play here
        }
}
