Description
===========

A hearts solitaire game written in typescript.


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


Dependencies
============

- typescript: 1.8
- jquery : 2.2
- jqueryui : 1.11
    - dialog
    - smoothness theme
- createjs
    - easeljs: 0.8
    - preloadjs: 0.6
    - tweenjs: 0.6


Images
======

- cards images : 1.3
    - https://code.google.com/p/vector-playing-cards/
    - public domain

- cards back
    - http://opengameart.org/content/colorful-poker-card-back
    - license: CC-BY 3.0 (Attribution 3.0 Un-ported)