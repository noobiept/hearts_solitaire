/// <reference path='player.ts' />

class Bot extends Player
{
    constructor( args )
        {
        super( args )
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
            // choose 3 random cards for now //HERE
        var suits = _.keys( this.cards );
        var count = 0;

        for (var a = 0 ; a < suits.length ; a++)
            {
            var suit = this.cards[ suits[ a ] ];

            var positions = getSeveralRandomInt( 0, suit.length - 1, 3 );

            for (var b = 0 ; b < positions.length ; b++)
                {
                Game.addCardPlayQueue( suit[ positions[ b ] ] );
                count++;

                if ( count >= 3 )
                    {
                    return;
                    }
                }
            }
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
            }

        else
            {
            var suits = [ 'clubs', 'diamonds', 'spades' ];

            if ( isHeartsBroken || this.cards[ 'hearts' ].length === this.cardsCount )
                {
                suits.push( 'hearts' );
                }

            for (var a = 0 ; a < suits.length ; a++)
                {
                var suit = this.cards[ suits[ a ] ];

                if ( suit.length > 0 )
                    {
                    var position = getRandomInt( 0, suit.length - 1 );

                    Game.addCardPlayQueue( suit[ position ] );
                    return;
                    }
                }
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


            var highestCards = [];
            var suits = _.keys( this.cards );

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
                card = highestCards[ a ];

                if ( card.suitSymbol > highest.suitSymbol )
                    {
                    highest = card;
                    }
                }

            Game.addCardPlayQueue( highest );
            }
        }
}
