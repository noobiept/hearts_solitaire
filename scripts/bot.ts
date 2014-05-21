/// <reference path='player.ts' />

class Bot extends Player
{
    constructor( args )
        {
        this.isBot = true;

        super( args );
        }

    yourTurn()
        {
            // things i need to know
        var heartsBroken = Round.isHeartsBroken();
        var firstTurn = Round.isFirstTurn();
        var passPhase = Game.isPassCardsPhase();
        var leadCard = Round.getLeadCard();


        if ( passPhase )
            {
            this.passCardPhaseLogic();
            }

        else
            {
                // we're starting the round
            if ( leadCard === null )
                {
                this.leadCardLogic( firstTurn, heartsBroken )
                }

            else
                {
                this.respondCardLogic( leadCard );
                }
            }
        }

    passCardPhaseLogic()
        {
            // get the 3 highest cards of each suit
        var highestCards = [];
        var a;
        var suits = _.keys( this.cards );
        var highest;
        var secondHighest;
        var thirdHighest;

        for (a = 0 ; a < suits.length ; a++)
            {
            var cards = this.cards[ suits[ a ] ];

            highest = cards[ cards.length - 1 ];
            secondHighest = cards[ cards.length - 2 ];
            thirdHighest = cards[ cards.length - 3 ];

            if ( highest )
                {
                highestCards.push( highest );
                }

            if ( secondHighest )
                {
                highestCards.push( secondHighest );
                }

            if ( thirdHighest )
                {
                highestCards.push( thirdHighest );
                }
            }


            // now get the 3 highest of all the suits
        highestCards.sort(function( a, b )
            {
            return a.suitSymbol - b.suitSymbol;
            });

        Game.addCardPlayQueue( highestCards[ highestCards.length - 1 ] );
        Game.addCardPlayQueue( highestCards[ highestCards.length - 2 ] );
        Game.addCardPlayQueue( highestCards[ highestCards.length - 3 ] );
        }

    /*
        When we're starting the turn
     */
    leadCardLogic( isFirstTurn, isHeartsBroken )
        {
            // means we have the two of clubs
        if ( isFirstTurn )
            {
            Game.addCardPlayQueue( this.cards[ 'clubs' ][ 0 ] );
            return;
            }


        var currentTurn = Round.getCurrentTurn();

            // pick a high symbol card in the first rounds (of clubs or diamonds)
        if ( currentTurn <= 3 && (this.cards[ 'clubs' ].length > 0 || this.cards[ 'diamonds' ].length > 0) )
            {
            var highest = this.getHighestCard( [ 'clubs', 'diamonds' ] );

            Game.addCardPlayQueue( highest );
            }

            // otherwise pick a low symbol card
        else
            {
                // if we don't have anything above the queen of spades, try to force it out by playing spades
            var aboveQueenSpades = false;
            var spadesCards = this.cards[ 'spades' ];

            for (var a = 0 ; a < spadesCards.length ; a++)
                {
                if ( spadesCards[ a ].suitSymbol >= Cards.SuitSymbol.queen )
                    {
                    aboveQueenSpades = true;
                    break;
                    }
                }

            if ( !aboveQueenSpades && spadesCards.length > 0 )
                {
                Game.addCardPlayQueue( spadesCards[ spadesCards.length - 1 ] );
                return;
                }


                // otherwise just play some random low symbol card
            var suits = [ 'clubs', 'diamonds', 'spades' ];

            if ( isHeartsBroken || this.cards[ 'hearts' ].length === this.cardsCount )
                {
                suits.push( 'hearts' );
                }

            var lowest = this.getLowestCard( suits );

                // don't play the queen of spades as long as there's other spades cards
            if ( lowest.suit == Cards.Suit.spades && lowest.suitSymbol == Cards.SuitSymbol.queen )
                {
                if ( this.cards[ 'spades' ].length > 1 )
                    {
                        // lowest is queen so its position 0 in array, so we can just get the next card
                    lowest = this.cards[ 'spades' ][ 1 ];
                    }
                }

            Game.addCardPlayQueue( lowest );
            }
        }

    /*
        We're following the lead
     */
    respondCardLogic( leadCard )
        {
        var leadSuit = leadCard.suit;
        var leadSuitStr = Cards.Suit[ leadSuit ];
        var cards = this.cards[ leadSuitStr ];
        var cardsPlayed = Round.cardsPlayed();
        var a;
        var card;

            // check if we have cards of that suit
        if ( cards.length > 0 )
            {
                // if a card higher than the queen of spades has been played, we play queen of spades (if we have it)
            if ( leadSuit == Cards.Suit.spades && leadCard.suitSymbol > Cards.SuitSymbol.queen )
                {
                for (a = 0 ; a < cards.length ; a++)
                    {
                    card = cards[ a ];

                    if ( card.suitSymbol === Cards.SuitSymbol.queen )
                        {
                        Game.addCardPlayQueue( card );
                        return;
                        }
                    }
                }

                // find the highest value played in the turn
            var highestSymbol = cardsPlayed[ 0 ].suitSymbol;

            for (a = 1 ; a < cardsPlayed.length ; a++)
                {
                card = cardsPlayed[ a ];

                if ( card.suitSymbol > highestSymbol )
                    {
                    highestSymbol = card.suitSymbol;
                    }
                }


            var closestBelow = null;
            var closestAbove = null;

                // from the cards we have, find the closest to the highest card played
            for (a = 0 ; a < cards.length ; a++)
                {
                var card = cards[ a ];

                if ( card.suitSymbol < highestSymbol )
                    {
                    if ( closestBelow === null )
                        {
                        closestBelow = card;
                        }

                    else if ( closestBelow.suitSymbol < card.suitSymbol )
                        {
                        closestBelow = card;
                        }
                    }

                else if ( card.suitSymbol > highestSymbol )
                    {
                    if ( closestAbove === null )
                        {
                        closestAbove = card;
                        }

                    else if ( closestAbove.suitSymbol > card.suitSymbol )
                        {
                        closestAbove = card;
                        }
                    }
                }


                // playing the card just below the lead takes priority (so that we don't win the turn)
            if ( closestBelow !== null )
                {
                Game.addCardPlayQueue( closestBelow );
                }

            else
                {
                    // if we're the last one playing in the round, and we don't have a card below (so we're winning the round regardless), we can play the highest card we have
                if ( cardsPlayed.length === 3 )
                    {
                    Game.addCardPlayQueue( cards[ cards.length - 1 ] );
                    }

                else
                    {
                        // don't play the queen of spades as long as there's other spades cards
                    if ( closestAbove == Cards.Suit.spades && closestAbove.suitSymbol == Cards.SuitSymbol.queen )
                        {
                        if ( this.cards[ 'spades' ].length > 1 )
                            {
                            closestAbove = this.cards[ 'spades' ][ 1 ];
                            }
                        }

                    Game.addCardPlayQueue( closestAbove );
                    }
                }
            }

            // play queen of spades if we have it
            // play a hearts if we have it
            // otherwise just play the highest symbol we have
        else
            {
            var spadesCards = this.cards[ 'spades' ];

            for (a = 0 ; a < spadesCards.length ; a++)
                {
                card = spadesCards[ a ];

                if ( card.suitSymbol === Cards.SuitSymbol.queen )
                    {
                    Game.addCardPlayQueue( card );
                    return;
                    }
                }

            var heartsCards = this.cards[ 'hearts' ];

            if ( heartsCards.length > 0 )
                {
                Game.addCardPlayQueue( heartsCards[ heartsCards.length - 1 ] );
                return;
                }


            var highest = this.getHighestCard( _.keys( this.cards ) );

            Game.addCardPlayQueue( highest );
            }
        }


    getHighestCard( suits: string[] )
        {
        var highestCards = [];
        var a;

        for (a = 0 ; a < suits.length ; a++)
            {
            var cards = this.cards[ suits[ a ] ];

            if ( cards.length > 0 )
                {
                highestCards.push( cards[ cards.length - 1 ] );
                }
            }

        var highest = highestCards[ 0 ];

        for (a = 1 ; a < highestCards.length ; a++)
            {
            var card = highestCards[ a ];

            if ( card.suitSymbol > highest.suitSymbol )
                {
                highest = card;
                }
            }

        return highest;
        }

    getLowestCard( suits: string[] )
        {
        var lowestCards = [];
        var a;

        for (a = 0 ; a < suits.length ; a++)
            {
            var cards = this.cards[ suits[ a ] ];

            if ( cards.length > 0 )
                {
                lowestCards.push( cards[ 0 ] );
                }
            }

        var lowest = lowestCards[ 0 ];

        for (a = 1 ; a < lowestCards.length ; a++)
            {
            var card = lowestCards[ a ];

            if ( card.suitSymbol < lowest.suitSymbol )
                {
                lowest = card;
                }
            }

        return lowest;
        }

}