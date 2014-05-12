/// <reference path='../typings/tsd.d.ts' />

/// <reference path='game.ts' />

/*
    Libraries:

        - jquery : 2.1
        - createjs
            - easeljs: 0.7
            - preloadjs: 0.4
            - tweenjs: 0.5
        - underscore : 1.6
        - cards images : 1.3
            - https://code.google.com/p/vector-playing-cards/
            - public domain


    Hearts

    - 4 players (west / east / north / south( player )

    - each player starts with 13 cards
    - objective is to get the least amount of points
    - game ends when one player reaches 100 points

    - before each hand begins, each player chooses 3 cards and passes to other player (repeat)
        - first pass to left
        - second pass to right
        - third pass to front
    - clock-wise turns (for example: north, east, south, west)

    - each player needs to follow the suit (play a card of the same suit as the lead card (last card played))
    - if doesn't have a card of that suit, then he can play any other card
    - you gain points by getting a card from the heart suits, or the queen of spades
    - the player holding the 2 of clubs starts the first turn
    - the player that wins the turn, gets to start the next turn
    - no penalty card may be played on the first turn (hearts or queen of spades)
    - hearts cannot be led until they have been 'broken'
        - you can unlock the hearts when you don't have the lead suit (for example someone plays clubs and you don't have any clubs)
        - or if you only have hearts left in hand (if you're starting the round)
    - each heart card adds 1 point, and the queen of spades 13 points
    - if one player takes all the penalty cards, he gets no points and all the other opponents take 26 points


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

        - Message:
            - when game ends, to tell the score


    to doo:
        - when a round ends, the click (from choosing the last card) immediately triggers a new card from the new round
        - need to add a flag to tell when a card is being moved, and you can't continue the game until that ends
            - also, if clicked it forces the card to move immediately to the destination (so skip the animation)

 */

var G = {
        CANVAS: null,
        STAGE: null,
        FPS: 30,
        PRELOAD: null,
        BASE_URL: ''
    };

window.onload = function()
{
G.CANVAS = document.querySelector( '#MainCanvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

createjs.Ticker.setFPS( G.FPS );


G.CANVAS.width = 1200;
G.CANVAS.height = 800;


G.PRELOAD = new createjs.LoadQueue();

var manifest = [
        { id: 'ace_of_clubs', src: G.BASE_URL + 'images/ace_of_clubs.png' },
        { id: 'two_of_clubs', src: G.BASE_URL + 'images/2_of_clubs.png' },
        { id: 'three_of_clubs', src: G.BASE_URL + 'images/3_of_clubs.png' },
        { id: 'four_of_clubs', src: G.BASE_URL + 'images/4_of_clubs.png' },
        { id: 'five_of_clubs', src: G.BASE_URL + 'images/5_of_clubs.png' },
        { id: 'six_of_clubs', src: G.BASE_URL + 'images/6_of_clubs.png' },
        { id: 'seven_of_clubs', src: G.BASE_URL + 'images/7_of_clubs.png' },
        { id: 'eight_of_clubs', src: G.BASE_URL + 'images/8_of_clubs.png' },
        { id: 'nine_of_clubs', src: G.BASE_URL + 'images/9_of_clubs.png' },
        { id: 'ten_of_clubs', src: G.BASE_URL + 'images/10_of_clubs.png' },
        { id: 'jack_of_clubs', src: G.BASE_URL + 'images/jack_of_clubs.png' },
        { id: 'queen_of_clubs', src: G.BASE_URL + 'images/queen_of_clubs.png' },
        { id: 'king_of_clubs', src: G.BASE_URL + 'images/king_of_clubs.png' },

        { id: 'ace_of_diamonds', src: G.BASE_URL + 'images/ace_of_diamonds.png' },
        { id: 'two_of_diamonds', src: G.BASE_URL + 'images/2_of_diamonds.png' },
        { id: 'three_of_diamonds', src: G.BASE_URL + 'images/3_of_diamonds.png' },
        { id: 'four_of_diamonds', src: G.BASE_URL + 'images/4_of_diamonds.png' },
        { id: 'five_of_diamonds', src: G.BASE_URL + 'images/5_of_diamonds.png' },
        { id: 'six_of_diamonds', src: G.BASE_URL + 'images/6_of_diamonds.png' },
        { id: 'seven_of_diamonds', src: G.BASE_URL + 'images/7_of_diamonds.png' },
        { id: 'eight_of_diamonds', src: G.BASE_URL + 'images/8_of_diamonds.png' },
        { id: 'nine_of_diamonds', src: G.BASE_URL + 'images/9_of_diamonds.png' },
        { id: 'ten_of_diamonds', src: G.BASE_URL + 'images/10_of_diamonds.png' },
        { id: 'jack_of_diamonds', src: G.BASE_URL + 'images/jack_of_diamonds.png' },
        { id: 'queen_of_diamonds', src: G.BASE_URL + 'images/queen_of_diamonds.png' },
        { id: 'king_of_diamonds', src: G.BASE_URL + 'images/king_of_diamonds.png' },

        { id: 'ace_of_spades', src: G.BASE_URL + 'images/ace_of_spades.png' },
        { id: 'two_of_spades', src: G.BASE_URL + 'images/2_of_spades.png' },
        { id: 'three_of_spades', src: G.BASE_URL + 'images/3_of_spades.png' },
        { id: 'four_of_spades', src: G.BASE_URL + 'images/4_of_spades.png' },
        { id: 'five_of_spades', src: G.BASE_URL + 'images/5_of_spades.png' },
        { id: 'six_of_spades', src: G.BASE_URL + 'images/6_of_spades.png' },
        { id: 'seven_of_spades', src: G.BASE_URL + 'images/7_of_spades.png' },
        { id: 'eight_of_spades', src: G.BASE_URL + 'images/8_of_spades.png' },
        { id: 'nine_of_spades', src: G.BASE_URL + 'images/9_of_spades.png' },
        { id: 'ten_of_spades', src: G.BASE_URL + 'images/10_of_spades.png' },
        { id: 'jack_of_spades', src: G.BASE_URL + 'images/jack_of_spades.png' },
        { id: 'queen_of_spades', src: G.BASE_URL + 'images/queen_of_spades.png' },
        { id: 'king_of_spades', src: G.BASE_URL + 'images/king_of_spades.png' },

        { id: 'ace_of_hearts', src: G.BASE_URL + 'images/ace_of_hearts.png' },
        { id: 'two_of_hearts', src: G.BASE_URL + 'images/2_of_hearts.png' },
        { id: 'three_of_hearts', src: G.BASE_URL + 'images/3_of_hearts.png' },
        { id: 'four_of_hearts', src: G.BASE_URL + 'images/4_of_hearts.png' },
        { id: 'five_of_hearts', src: G.BASE_URL + 'images/5_of_hearts.png' },
        { id: 'six_of_hearts', src: G.BASE_URL + 'images/6_of_hearts.png' },
        { id: 'seven_of_hearts', src: G.BASE_URL + 'images/7_of_hearts.png' },
        { id: 'eight_of_hearts', src: G.BASE_URL + 'images/8_of_hearts.png' },
        { id: 'nine_of_hearts', src: G.BASE_URL + 'images/9_of_hearts.png' },
        { id: 'ten_of_hearts', src: G.BASE_URL + 'images/10_of_hearts.png' },
        { id: 'jack_of_hearts', src: G.BASE_URL + 'images/jack_of_hearts.png' },
        { id: 'queen_of_hearts', src: G.BASE_URL + 'images/queen_of_hearts.png' },
        { id: 'king_of_hearts', src: G.BASE_URL + 'images/king_of_hearts.png' }
    ];
G.PRELOAD.addEventListener( 'progress', function( event )
    {
        // (event.progress * 100 | 0) + '%'
    });
G.PRELOAD.addEventListener( 'complete', Game.start );
G.PRELOAD.loadManifest( manifest, true );
};

