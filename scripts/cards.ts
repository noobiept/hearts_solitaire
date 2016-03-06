/// <reference path='main.ts' />
/// <reference path='utilities.ts' />
/// <reference path='player.ts' />
/// <reference path='move_animation.ts' />

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

centerCards();
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
    if ( ALL[ a ].moveAnimation.isMoving )
        {
        return true;
        }
    }

return false;
}

/*
    If there's a card moving, force it to the destination (without the animation)
 */

export function forceMoveToDestination()
{
for (var a = 0 ; a < ALL.length ; a++)
    {
    ALL[ a ].moveAnimation.end();
    }
}


export function centerCards()
{
var x = G.CANVAS.width / 2 - IndividualCard.width / 2;
var y = G.CANVAS.height / 2 - IndividualCard.height / 2;

for (var a = 0 ; a < ALL.length ; a++)
    {
    ALL[ a ].setPosition( x, y );
    }
}


export function get( suit: Suit, symbol: SuitSymbol )
{
for (var a = 0 ; a < ALL.length ; a++)
    {
    var card = ALL[ a ];

    if ( card.suit == suit && card.suitSymbol == symbol )
        {
        return card;
        }
    }

return null;
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
    frontImage: HTMLImageElement;
    backImage: HTMLImageElement;
    showingFront: boolean;

    click_f;
    suit: Suit;
    suitSymbol: SuitSymbol;
    player: Player;
    moveAnimation: MoveAnimation.Move;

    static width = 150;
    static height = 218;


    constructor( args: IndividualCardArgs )
        {
        this.suit = args.suit;
        this.suitSymbol = args.suitSymbol;

        var imageId = SuitSymbol[ this.suitSymbol ] + '_of_' + Suit[ this.suit ];

        this.frontImage = <HTMLImageElement> G.PRELOAD.getResult( imageId );
        this.backImage = <HTMLImageElement> G.PRELOAD.getResult( 'card_back' );

        this.bitmap = new createjs.Bitmap( this.backImage );

        this.showingFront = false;

        this.moveAnimation = new MoveAnimation.Move( this.bitmap );
        this.click_f = null;

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

    moveTo( x: number, y: number, animationDuration: number, callback?: ( card: IndividualCard ) => any )
        {
        var _this = this;

        this.moveAnimation.start( x, y, animationDuration, function()
            {
            if ( callback )
                {
                callback( _this );
                }
            });
        }

    moveAndHide( x: number, y: number, animationDuration: number )
        {
        var _this = this;

        this.moveTo( x, y, animationDuration, function() { _this.hide(); } );
        }

    setClickEvent( set: boolean )
        {
        if ( set == true )
            {
            if ( this.click_f === null )
                {
                this.click_f = this.bitmap.on( 'click', this.clicked, this );
                }
            }

        else
            {
            if ( this.click_f !== null )
                {
                this.bitmap.off( 'click', this.click_f );
                this.click_f = null;
                }
            }
        }


    clicked( event )
        {
        Message.close();

            // left click
        if ( event.nativeEvent.button == 0 )
            {
                // check if valid move
            if ( Game.isValidMove( this ) )
                {
                Game.addCardPlayQueue( this );
                }
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

    changeSide( front: boolean )
        {
        if ( front === true && this.showingFront === false )
            {
            this.bitmap.image = this.frontImage;

            this.showingFront = true;
            }

        else if ( front === false && this.showingFront === true )
            {
            this.bitmap.image = this.backImage;

            this.showingFront = false;
            }
        }


    remove()
        {
        this.setClickEvent( false );

        G.STAGE.removeChild( this.bitmap );
        }

    getX()
        {
        return this.bitmap.x;
        }

    getY()
        {
        return this.bitmap.y;
        }
    }
}