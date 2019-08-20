# [Try it out here!](http://nbpt.eu/games/hearts_solitaire/)

# Description

A hearts solitaire game written in typescript.

-   4 players (west / east / north / south).
-   The human player is always in the south position.
-   Each player starts with 13 cards.
-   The objective is to get the least amount of points.
-   The game ends when one player has over 100 points.
-   Before each hand begins, each player chooses 3 cards and passes to other player.
    -   first pass to left
    -   second pass to right
    -   third pass to front
    -   repeat from the start
-   After selecting 3 cards, click on the arrow in the center.
-   The play order is clock-wise (for example: north, east, south, west).
-   Each player needs to follow the suit (play a card of the same suit as the lead card (last card played)).
-   If a player doesn't have a card of that suit, then he can play any other card.
-   You gain points by getting a card from the heart suits, or the queen of spades (so you want to avoid those!).
-   The player holding the 2 of clubs starts the first turn.
-   The player that wins the turn, gets to start the next turn.
-   No penalty card can be played on the first turn (hearts or queen of spades).
-   Hearts cannot be led until they have been 'broken'.
    -   You can unlock the hearts when you don't have a card of the lead suit (for example someone plays clubs and you don't have any clubs).
    -   Or if you only have hearts left in your hand (if you're starting the round).
-   Each heart card adds 1 point, and the queen of spades 13 points.
-   If one player takes all the penalty cards, he gets no points and all the other opponents take 26 points.
-   Right-clicking with the mouse, skips the move animation of the cards.

# Commands

-   `npm run dev` (Compile and run the game locally on `localhost:8000/`)

# Images

-   cards images : 1.3

    -   https://code.google.com/p/vector-playing-cards/
    -   public domain

-   cards back
    -   http://opengameart.org/content/colorful-poker-card-back
    -   license: CC-BY 3.0 (Attribution 3.0 Un-ported)
