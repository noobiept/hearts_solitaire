module Game
{


export function start()
{
Cards.init();

createjs.Ticker.on( 'tick', tick );
}



export function tick()
{
G.STAGE.update();
}



}