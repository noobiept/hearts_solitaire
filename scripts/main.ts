/// <reference path='game.ts' />

/*
    classes:
        - Card:
            - draw card, move

        - Player:
            - position the cards in order of suit (clubs / diamonds / spades / hearts)
            - can be shown (for the player) / hidden (the bots)
            - position in top/bottom/left/right

        - Bot (inherits from Player):
            - has the bot game logic

        - Round:
            - receives each players card
            - position them in the center
            - determines if a player move is valid or not

        - Game:
            - which turn it is
            - knows if the hearts have been broken or not

        - GameMenu:
            - current players points
            - restart
 */

interface Global {
    CANVAS: HTMLCanvasElement;
    STAGE: createjs.Stage;
    PRELOAD: createjs.LoadQueue;
    DEBUG: boolean;
}

var G: Global = {
        CANVAS: null,
        STAGE: null,
        PRELOAD: null,
        DEBUG: false
    };


window.onload = function()
{
AppStorage.getData( [ 'hearts_statistics' ], function( data )
    {
    Statistics.load( data[ 'hearts_statistics' ] );
    initApp();
    });
};


function initApp()
{
G.CANVAS = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

createjs.Ticker.timingMode = createjs.Ticker.RAF;

G.PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'card_back', src: 'images/card_back_black.png' },

        { id: 'ace_of_clubs', src: 'images/ace_of_clubs.png' },
        { id: 'two_of_clubs', src: 'images/2_of_clubs.png' },
        { id: 'three_of_clubs', src: 'images/3_of_clubs.png' },
        { id: 'four_of_clubs', src: 'images/4_of_clubs.png' },
        { id: 'five_of_clubs', src: 'images/5_of_clubs.png' },
        { id: 'six_of_clubs', src: 'images/6_of_clubs.png' },
        { id: 'seven_of_clubs', src: 'images/7_of_clubs.png' },
        { id: 'eight_of_clubs', src: 'images/8_of_clubs.png' },
        { id: 'nine_of_clubs', src: 'images/9_of_clubs.png' },
        { id: 'ten_of_clubs', src: 'images/10_of_clubs.png' },
        { id: 'jack_of_clubs', src: 'images/jack_of_clubs2.png' },
        { id: 'queen_of_clubs', src: 'images/queen_of_clubs2.png' },
        { id: 'king_of_clubs', src: 'images/king_of_clubs2.png' },

        { id: 'ace_of_diamonds', src: 'images/ace_of_diamonds.png' },
        { id: 'two_of_diamonds', src: 'images/2_of_diamonds.png' },
        { id: 'three_of_diamonds', src: 'images/3_of_diamonds.png' },
        { id: 'four_of_diamonds', src: 'images/4_of_diamonds.png' },
        { id: 'five_of_diamonds', src: 'images/5_of_diamonds.png' },
        { id: 'six_of_diamonds', src: 'images/6_of_diamonds.png' },
        { id: 'seven_of_diamonds', src: 'images/7_of_diamonds.png' },
        { id: 'eight_of_diamonds', src: 'images/8_of_diamonds.png' },
        { id: 'nine_of_diamonds', src: 'images/9_of_diamonds.png' },
        { id: 'ten_of_diamonds', src: 'images/10_of_diamonds.png' },
        { id: 'jack_of_diamonds', src: 'images/jack_of_diamonds2.png' },
        { id: 'queen_of_diamonds', src: 'images/queen_of_diamonds2.png' },
        { id: 'king_of_diamonds', src: 'images/king_of_diamonds2.png' },

        { id: 'ace_of_spades', src: 'images/ace_of_spades.png' },
        { id: 'two_of_spades', src: 'images/2_of_spades.png' },
        { id: 'three_of_spades', src: 'images/3_of_spades.png' },
        { id: 'four_of_spades', src: 'images/4_of_spades.png' },
        { id: 'five_of_spades', src: 'images/5_of_spades.png' },
        { id: 'six_of_spades', src: 'images/6_of_spades.png' },
        { id: 'seven_of_spades', src: 'images/7_of_spades.png' },
        { id: 'eight_of_spades', src: 'images/8_of_spades.png' },
        { id: 'nine_of_spades', src: 'images/9_of_spades.png' },
        { id: 'ten_of_spades', src: 'images/10_of_spades.png' },
        { id: 'jack_of_spades', src: 'images/jack_of_spades2.png' },
        { id: 'queen_of_spades', src: 'images/queen_of_spades2.png' },
        { id: 'king_of_spades', src: 'images/king_of_spades2.png' },

        { id: 'ace_of_hearts', src: 'images/ace_of_hearts.png' },
        { id: 'two_of_hearts', src: 'images/2_of_hearts.png' },
        { id: 'three_of_hearts', src: 'images/3_of_hearts.png' },
        { id: 'four_of_hearts', src: 'images/4_of_hearts.png' },
        { id: 'five_of_hearts', src: 'images/5_of_hearts.png' },
        { id: 'six_of_hearts', src: 'images/6_of_hearts.png' },
        { id: 'seven_of_hearts', src: 'images/7_of_hearts.png' },
        { id: 'eight_of_hearts', src: 'images/8_of_hearts.png' },
        { id: 'nine_of_hearts', src: 'images/9_of_hearts.png' },
        { id: 'ten_of_hearts', src: 'images/10_of_hearts.png' },
        { id: 'jack_of_hearts', src: 'images/jack_of_hearts2.png' },
        { id: 'queen_of_hearts', src: 'images/queen_of_hearts2.png' },
        { id: 'king_of_hearts', src: 'images/king_of_hearts2.png' },

        { id: 'pass_left', src: 'images/pass_left.png' },
        { id: 'pass_left_effect', src: 'images/pass_left_effect.png' },
        { id: 'pass_right', src: 'images/pass_right.png' },
        { id: 'pass_right_effect', src: 'images/pass_right_effect.png' },
        { id: 'pass_across', src: 'images/pass_across.png' },
        { id: 'pass_across_effect', src: 'images/pass_across_effect.png' }
    ];

var loadMessage = document.querySelector( '#LoadMessage' );

var left = $( window ).width() / 2;
var top = $( window ).height() / 2;

$( loadMessage ).css( 'top', top + 'px' );
$( loadMessage ).css( 'left', left + 'px' );

G.PRELOAD.addEventListener( 'progress', function( event: createjs.ProgressEvent )
    {
    $( loadMessage ).text( (event.progress * 100 | 0) + '%' );
    });
G.PRELOAD.addEventListener( 'complete', function()
    {
    $( loadMessage ).css( 'display', 'none' );

    Game.start();
    });
G.PRELOAD.loadManifest( manifest, true );
}
