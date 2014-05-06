/// <reference path='hand.ts' />

interface PlayerArgs extends HandArgs
    {

    }

class Player
{
    hand: Hand;


    constructor( args: PlayerArgs )
        {
        this.hand = new Hand({
                show: args.show,
                position: args.position
            });
        }
}