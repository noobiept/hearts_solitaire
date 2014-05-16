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
            var card;

                // check if valid move
            if ( Game.isValidMove( card ) )
                {
                Game.addCardPlayQueue( card );
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
}