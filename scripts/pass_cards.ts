module PassCards
{
var ELEMENT: createjs.Bitmap;
var IMAGES = {};


export function init()
    {
    IMAGES[ Game.Pass.left ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_left' );
    IMAGES[ Game.Pass.right ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_right' );
    IMAGES[ Game.Pass.across ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_across' );

    ELEMENT = new createjs.Bitmap( IMAGES[ Game.Pass.left ] );
    ELEMENT.visible = false;
    ELEMENT.on( 'click', Game.passCards );

    G.STAGE.addChild( ELEMENT );
    }


export function setPosition( x: number, y: number )
    {
    ELEMENT.x = x;
    ELEMENT.y = y;
    }


export function show()
    {
    ELEMENT.visible = true;
    }


export function hide()
    {
    ELEMENT.visible = false;
    }


export function select( direction: Game.Pass )
    {
    ELEMENT.image = IMAGES[ direction ];
    PassCards.show();
    }
}