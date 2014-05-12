/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />
/// <reference path='utilities.ts' />
/// <reference path='player.ts' />

/*
    Will manage all the cards
 */

module Cards
{
export enum Suit { clubs, diamonds, spades, hearts }
export enum SuitSymbol { two, three, four, five, six, seven, eight, nine, ten, jack, queen, king, ace }

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


/*
    Gets a random card that isn't being used at the moment
 */

export function getRandom()
{
var position = getRandomInt( 0, ALL_AVAILABLE.length - 1 );

var card = ALL_AVAILABLE.splice( position, 1 )[ 0 ];

return card;
}


/*
    Flags a card as not being used
 */

export function setAvailable( card: IndividualCard )
{
ALL_AVAILABLE.push( card );
}

/*
    Tells if a card is currently moving or not
 */

export function isMoving()
{
for (var a = 0 ; a < ALL.length ; a++)
    {
    if ( ALL[ a ].isMoving )
        {
        return true;
        }
    }

return false;
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
    click_f;
    suit: Suit;
    suitSymbol: SuitSymbol;
    player: Player;
    isMoving: boolean;

    static scale = 0.3;
    static width = 500 * IndividualCard.scale;
    static height = 726 * IndividualCard.scale;


    constructor( args: IndividualCardArgs )
        {
        var _this = this;

        this.suit = args.suit;
        this.suitSymbol = args.suitSymbol;
        this.isMoving = false;

        var imageId = SuitSymbol[ this.suitSymbol ] + '_of_' + Suit[ this.suit ];

        this.bitmap = new createjs.Bitmap( G.PRELOAD.getResult( imageId ) );
        this.click_f = this.bitmap.on( 'click', this.clicked, this );
        this.bitmap.visible = false;

        var scale = 0.2;

        this.bitmap.scaleX = scale;
        this.bitmap.scaleY = scale;

        G.STAGE.addChild( this.bitmap );
        }

    setPosition( x: number, y: number )
        {
        this.bitmap.x = x;
        this.bitmap.y = y;
        }

    setPlayer( player: Player )
        {
        this.player = player;
        }

    moveTo( x: number, y: number, callback?: () => any )
        {
        var _this = this;
        this.isMoving = true;

        createjs.Tween.get( this.bitmap ).to({ x: x, y: y }, 500 ).call( function()
            {
            _this.isMoving = false;

            createjs.Tween.removeTweens( _this.bitmap );

            if (_.isFunction( callback ) )
                {
                callback();
                }
            });
        }

    moveAndHide( x: number, y: number )
        {
        var _this = this;
        this.isMoving = true;

        createjs.Tween.get( this.bitmap ).to({ x: x, y: y }, 500 ).call( function()
            {
            _this.isMoving = false;
            _this.hide();
            });
        }

    clicked()
        {
            // check if valid move
        if ( Game.isValidMove( this ) )
            {
            Round.playCard( this );
            }
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

    remove()
        {
        this.bitmap.off( 'click', this.click_f );
        this.click_f = null;

        G.STAGE.removeChild( this.bitmap );
        }
    }
}