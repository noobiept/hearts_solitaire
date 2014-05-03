/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />

/*
    Will manage all the cards
 */

module Cards
{
enum Suit { clubs, diamonds, spades, hearts }
enum SuitSymbol { ace, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king }

var ALL: IndividualCard[] = [];
var ALL_AVAILABLE: IndividualCard[] = [];


export function init()
{
var cards = [
        'ace_of_clubs', '2_of_clubs', '3_of_clubs', '4_of_clubs', '5_of_clubs', '6_of_clubs', '7_of_clubs', '8_of_clubs', '9_of_clubs', '10_of_clubs', 'jack_of_clubs', 'queen_of_clubs', 'king_of_clubs'

    ];

var test = new IndividualCard({
    imageId: '2_of_clubs',
    suit: Suit.clubs,
    suitSymbol: SuitSymbol.ace
    });

test.moveTo( 20, 20 );
}


export function getRandom()
{

}


/*
    One object for each individual card
 */

interface IndividualCardArgs
    {
    imageId: string;
    suit: Suit;
    suitSymbol: SuitSymbol;
    }

class IndividualCard
    {
    bitmap: createjs.Bitmap;
    suit: Suit;
    suitSymbol: SuitSymbol;

    constructor( args: IndividualCardArgs )
        {
        this.bitmap = new createjs.Bitmap( G.PRELOAD.getResult( args.imageId ) );

        this.suit = args.suit;
        this.suitSymbol = args.suitSymbol;

        G.STAGE.addChild( this.bitmap );
        }

    moveTo( x: number, y: number )
        {
        this.bitmap.x = x;
        this.bitmap.y = y;
        }
    }


}