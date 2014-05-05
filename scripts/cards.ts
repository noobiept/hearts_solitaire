/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />
/// <reference path='utilities.ts' />

/*
    Will manage all the cards
 */

module Cards
{
export enum Suit { clubs= 0, diamonds, spades, hearts }
export enum SuitSymbol { ace= 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king }

var ALL: IndividualCard[] = [];
var ALL_AVAILABLE: IndividualCard[] = [];


export function init()
{
var cards = [
        'ace_of_clubs', '2_of_clubs', '3_of_clubs', '4_of_clubs', '5_of_clubs', '6_of_clubs', '7_of_clubs', '8_of_clubs', '9_of_clubs', '10_of_clubs', 'jack_of_clubs', 'queen_of_clubs', 'king_of_clubs'

    ];

var suitLength = 4;
var symbolLength = 13;

for (var a = 0 ; a < suitLength ; a++)
    {
    for (var b = 0 ; b < symbolLength ; b++)
        {
        var card = new IndividualCard({
                suit: a,
                suitSymbol: b
            });

        ALL.push( card );
        }
    }


var test = Cards.getRandom();

test.show();
test.moveTo( 20, 20 );
}


export function getRandom()
{
var position = getRandomInt( 0, ALL.length - 1 );

return ALL[ position ];
}


/*
    One object for each individual card
 */

export interface IndividualCardArgs
    {
    suit: Suit;
    suitSymbol: SuitSymbol;
    }

export class IndividualCard
    {
    bitmap: createjs.Bitmap;
    suit: Suit;
    suitSymbol: SuitSymbol;

    constructor( args: IndividualCardArgs )
        {
        this.suit = args.suit;
        this.suitSymbol = args.suitSymbol;

        var imageId = SuitSymbol[ this.suitSymbol ] + '_of_' + Suit[ this.suit ];

        this.bitmap = new createjs.Bitmap( G.PRELOAD.getResult( imageId ) );
        this.bitmap.visible = false;
        this.bitmap.scaleX = 0.5;
        this.bitmap.scaleY = 0.5;

        G.STAGE.addChild( this.bitmap );
        }

    moveTo( x: number, y: number )
        {
        this.bitmap.x = x;
        this.bitmap.y = y;
        }

    show()
        {
        this.bitmap.visible = true;
        }

    hide()
        {
        this.bitmap.visible = false;
        }
    }


}