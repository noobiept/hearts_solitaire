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
                this.respondCardLogic( leadCard, heartsBroken );
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
    respondCardLogic( leadCard, isHeartsBroken )
        {
        var leadSuit = leadCard.suit;
        var leadSuitStr = Cards.Suit[ leadSuit ];
        var cards = this.cards[ leadSuitStr ];

            // check if we have cards of that suit
        if ( cards.length > 0 )
            {
                // play a random card for now //HERE
            var position = getRandomInt( 0, cards.length - 1 );

            Game.addCardPlayQueue( cards[ position ] );
            }

        else
            {
                // play a random card from other suit //HERE
            var suits = [ 'clubs', 'diamonds', 'spades', 'hearts' ];

                // remove the lead suit (which we don't have cards of)
            var index = suits.indexOf( leadSuitStr );
            suits.splice( index, 1 );

            for (var a = 0 ; a < suits.length ; a++)
                {
                var cards = this.cards[ suits[ a ] ];

                if ( cards.length > 0 )
                    {
                    var position = getRandomInt( 0, cards.length - 1 );

                    Game.addCardPlayQueue( cards[ position ] );
                    return;
                    }
                }
            }
        }
}
