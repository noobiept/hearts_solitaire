module PassCards
{
var ELEMENT: createjs.Bitmap;
var IMAGES = {};
var CURRENT_DIRECTION: Game.Pass;


export function init()
    {
    IMAGES[ Game.Pass.left ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_left' );
    IMAGES[ Game.Pass.left + '_effect' ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_left_effect' );
    IMAGES[ Game.Pass.right ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_right' );
    IMAGES[ Game.Pass.right + '_effect' ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_right_effect' );
    IMAGES[ Game.Pass.across ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_across' );
    IMAGES[ Game.Pass.across + '_effect' ] = <HTMLImageElement> G.PRELOAD.getResult( 'pass_across_effect' );

    CURRENT_DIRECTION = Game.Pass.left;
    ELEMENT = new createjs.Bitmap( IMAGES[ CURRENT_DIRECTION ] );
    ELEMENT.visible = false;
    ELEMENT.filters = [];
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
    CURRENT_DIRECTION = direction;
    ELEMENT.image = IMAGES[ direction ];
    PassCards.show();
    }


export function addEffect()
    {
    ELEMENT.image = IMAGES[ CURRENT_DIRECTION + '_effect' ];
    }


export function removeEffect()
    {
    ELEMENT.image = IMAGES[ CURRENT_DIRECTION ];
    }
}