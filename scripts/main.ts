/// <reference path='../typings/browser.d.ts' />
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

var G = {
        CANVAS: null,
        STAGE: null,
        PRELOAD: null,
        DEBUG: false
    };

var BASE_URL = '';


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
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

createjs.Ticker.timingMode = createjs.Ticker.RAF;

G.CANVAS.width = 1200;
G.CANVAS.height = 900;

G.PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'card_back', src: BASE_URL + 'images/card_back_black.png' },

        { id: 'ace_of_clubs', src: BASE_URL + 'images/ace_of_clubs.png' },
        { id: 'two_of_clubs', src: BASE_URL + 'images/2_of_clubs.png' },
        { id: 'three_of_clubs', src: BASE_URL + 'images/3_of_clubs.png' },
        { id: 'four_of_clubs', src: BASE_URL + 'images/4_of_clubs.png' },
        { id: 'five_of_clubs', src: BASE_URL + 'images/5_of_clubs.png' },
        { id: 'six_of_clubs', src: BASE_URL + 'images/6_of_clubs.png' },
        { id: 'seven_of_clubs', src: BASE_URL + 'images/7_of_clubs.png' },
        { id: 'eight_of_clubs', src: BASE_URL + 'images/8_of_clubs.png' },
        { id: 'nine_of_clubs', src: BASE_URL + 'images/9_of_clubs.png' },
        { id: 'ten_of_clubs', src: BASE_URL + 'images/10_of_clubs.png' },
        { id: 'jack_of_clubs', src: BASE_URL + 'images/jack_of_clubs.png' },
        { id: 'queen_of_clubs', src: BASE_URL + 'images/queen_of_clubs.png' },
        { id: 'king_of_clubs', src: BASE_URL + 'images/king_of_clubs.png' },

        { id: 'ace_of_diamonds', src: BASE_URL + 'images/ace_of_diamonds.png' },
        { id: 'two_of_diamonds', src: BASE_URL + 'images/2_of_diamonds.png' },
        { id: 'three_of_diamonds', src: BASE_URL + 'images/3_of_diamonds.png' },
        { id: 'four_of_diamonds', src: BASE_URL + 'images/4_of_diamonds.png' },
        { id: 'five_of_diamonds', src: BASE_URL + 'images/5_of_diamonds.png' },
        { id: 'six_of_diamonds', src: BASE_URL + 'images/6_of_diamonds.png' },
        { id: 'seven_of_diamonds', src: BASE_URL + 'images/7_of_diamonds.png' },
        { id: 'eight_of_diamonds', src: BASE_URL + 'images/8_of_diamonds.png' },
        { id: 'nine_of_diamonds', src: BASE_URL + 'images/9_of_diamonds.png' },
        { id: 'ten_of_diamonds', src: BASE_URL + 'images/10_of_diamonds.png' },
        { id: 'jack_of_diamonds', src: BASE_URL + 'images/jack_of_diamonds.png' },
        { id: 'queen_of_diamonds', src: BASE_URL + 'images/queen_of_diamonds.png' },
        { id: 'king_of_diamonds', src: BASE_URL + 'images/king_of_diamonds.png' },

        { id: 'ace_of_spades', src: BASE_URL + 'images/ace_of_spades.png' },
        { id: 'two_of_spades', src: BASE_URL + 'images/2_of_spades.png' },
        { id: 'three_of_spades', src: BASE_URL + 'images/3_of_spades.png' },
        { id: 'four_of_spades', src: BASE_URL + 'images/4_of_spades.png' },
        { id: 'five_of_spades', src: BASE_URL + 'images/5_of_spades.png' },
        { id: 'six_of_spades', src: BASE_URL + 'images/6_of_spades.png' },
        { id: 'seven_of_spades', src: BASE_URL + 'images/7_of_spades.png' },
        { id: 'eight_of_spades', src: BASE_URL + 'images/8_of_spades.png' },
        { id: 'nine_of_spades', src: BASE_URL + 'images/9_of_spades.png' },
        { id: 'ten_of_spades', src: BASE_URL + 'images/10_of_spades.png' },
        { id: 'jack_of_spades', src: BASE_URL + 'images/jack_of_spades.png' },
        { id: 'queen_of_spades', src: BASE_URL + 'images/queen_of_spades.png' },
        { id: 'king_of_spades', src: BASE_URL + 'images/king_of_spades.png' },

        { id: 'ace_of_hearts', src: BASE_URL + 'images/ace_of_hearts.png' },
        { id: 'two_of_hearts', src: BASE_URL + 'images/2_of_hearts.png' },
        { id: 'three_of_hearts', src: BASE_URL + 'images/3_of_hearts.png' },
        { id: 'four_of_hearts', src: BASE_URL + 'images/4_of_hearts.png' },
        { id: 'five_of_hearts', src: BASE_URL + 'images/5_of_hearts.png' },
        { id: 'six_of_hearts', src: BASE_URL + 'images/6_of_hearts.png' },
        { id: 'seven_of_hearts', src: BASE_URL + 'images/7_of_hearts.png' },
        { id: 'eight_of_hearts', src: BASE_URL + 'images/8_of_hearts.png' },
        { id: 'nine_of_hearts', src: BASE_URL + 'images/9_of_hearts.png' },
        { id: 'ten_of_hearts', src: BASE_URL + 'images/10_of_hearts.png' },
        { id: 'jack_of_hearts', src: BASE_URL + 'images/jack_of_hearts.png' },
        { id: 'queen_of_hearts', src: BASE_URL + 'images/queen_of_hearts.png' },
        { id: 'king_of_hearts', src: BASE_URL + 'images/king_of_hearts.png' },

        { id: 'pass_left', src: BASE_URL + 'images/pass_left.png' },
        { id: 'pass_right', src: BASE_URL + 'images/pass_right.png' },
        { id: 'pass_across', src: BASE_URL + 'images/pass_across.png' }
    ];

var loadMessage = document.querySelector( '#LoadMessage' );

var left = $( window ).width() / 2;
var top = $( window ).height() / 2;

$( loadMessage ).css( 'top', top + 'px' );
$( loadMessage ).css( 'left', left + 'px' );

G.PRELOAD.addEventListener( 'progress', function( event )
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
