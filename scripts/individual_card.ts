import Player from "./player.js";
import * as Game from "./game.js";
import * as MoveAnimation from "./move_animation.js";
import * as Message from "./message.js";
import { Suit, SuitSymbol, getValueOf } from "./cards.js";
import { getAsset } from "./preload";

/*
    One object for each individual card
 */
export interface IndividualCardArgs {
    suit: Suit;
    suitSymbol: SuitSymbol;
}

export default class IndividualCard {
    private bitmap: createjs.Bitmap;
    private frontImage: HTMLImageElement;
    private backImage: HTMLImageElement;
    private showingFront: boolean;

    private click_f: Function | null;
    readonly suit: Suit;
    readonly suitSymbol: SuitSymbol;
    readonly symbolValue: number;

    player!: Player;
    moveAnimation: MoveAnimation.Move;
    selected: boolean;

    static width = 150;
    static height = 218;

    constructor(args: IndividualCardArgs) {
        this.suit = args.suit;
        this.suitSymbol = args.suitSymbol;
        this.symbolValue = getValueOf(args.suitSymbol);

        var imageId = this.suitSymbol + "_of_" + this.suit;

        this.frontImage = getAsset(imageId);
        this.backImage = getAsset("card_back");

        this.bitmap = new createjs.Bitmap(this.backImage);

        this.showingFront = false;
        this.selected = false;

        this.moveAnimation = new MoveAnimation.Move(this.bitmap);
        this.click_f = null;

        Game.addToStage(this.bitmap);
    }

    setPosition(x: number, y: number) {
        this.bitmap.x = x;
        this.bitmap.y = y;
    }

    setPlayer(player: Player) {
        this.player = player;
    }

    moveTo(
        x: number,
        y: number,
        animationDuration: number,
        callback?: (card: IndividualCard) => any
    ) {
        var _this = this;

        this.moveAnimation.start(x, y, animationDuration, function() {
            if (callback) {
                callback(_this);
            }
        });
    }

    moveAndHide(x: number, y: number, animationDuration: number) {
        var _this = this;

        this.moveTo(x, y, animationDuration, function() {
            _this.hide();
        });
    }

    setClickEvent(set: boolean) {
        if (set === true) {
            if (this.click_f === null) {
                this.click_f = this.bitmap.on(
                    "click",
                    this.clicked as any,
                    this
                );
            }
        } else {
            if (this.click_f !== null) {
                this.bitmap.off("click", this.click_f);
                this.click_f = null;
            }
        }
    }

    clicked(event: createjs.MouseEvent) {
        Message.close();

        // left click
        if (event.nativeEvent.button == 0) {
            // check if valid move
            if (Game.isValidMove(this)) {
                Game.addCardPlayQueue(this);
            }
        }
    }

    show() {
        Game.addToStage(this.bitmap); // to force it to up in the stack to be drawn on top of other stuff
        this.bitmap.visible = true;
    }

    hide() {
        this.bitmap.visible = false;
    }

    changeSide(front: boolean) {
        if (front === true && this.showingFront === false) {
            this.bitmap.image = this.frontImage;

            this.showingFront = true;
        } else if (front === false && this.showingFront === true) {
            this.bitmap.image = this.backImage;

            this.showingFront = false;
        }
    }

    remove() {
        this.setClickEvent(false);
        Game.removeFromStage(this.bitmap);
    }

    getX() {
        return this.bitmap.x;
    }

    getY() {
        return this.bitmap.y;
    }
}
