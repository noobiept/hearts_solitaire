/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />
/// <reference path='utilities.ts' />

/*
    Will manage all the cards
 */

module Cards
{
export enum Suit { clubs, diamonds, spades, hearts }
export enum SuitSymbol { 2, 3, 4, 5, 6, 7, 8, 9, 10, jack, queen, king, ace }

var ALL: IndividualCard[] = [];
var ALL_AVAILABLE: IndividualCard[] = [];


export function init()
{
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
        ALL_AVAILABLE.push( card );
        }
    }
}


export function getRandom()
{
var position = getRandomInt( 0, ALL_AVAILABLE.length - 1 );

var card = ALL_AVAILABLE.splice( position, 1 )[ 0 ];

return card;
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
        G.STAGE.addChild( this.bitmap );    // to force it to up in the stack to be drawn on top of other stuff
        this.bitmap.visible = true;
        }

    hide()
        {
        this.bitmap.visible = false;
        }
    }


}