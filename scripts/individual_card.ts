import Player from "./player";
import * as MoveAnimation from "./move_animation";
import { Suit, SuitSymbol, getValueOf } from "./cards";
import { getAsset } from "./preload";

/*
    One object for each individual card
 */
export interface IndividualCardArgs {
    suit: Suit;
    suitSymbol: SuitSymbol;
    addToStage: (element: createjs.DisplayObject) => void;
    onClick: (card: IndividualCard, leftButton: boolean) => void;
}

export default class IndividualCard {
    private bitmap: createjs.Bitmap;
    private frontImage: HTMLImageElement;
    private backImage: HTMLImageElement;
    private showingFront: boolean;

    private click_f: Function | null;
    private addToStage: (element: createjs.DisplayObject) => void;
    private onClick: (card: IndividualCard, leftButton: boolean) => void;

    readonly suit: Suit;
    readonly suitSymbol: SuitSymbol;
    readonly symbolValue: number;
    readonly moveAnimation: MoveAnimation.Move;

    player!: Player;
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
        this.addToStage = args.addToStage;
        this.onClick = args.onClick;

        args.addToStage(this.bitmap);
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
        this.moveAnimation.start(x, y, animationDuration, () => {
            if (callback) {
                callback(this);
            }
        });
    }

    /**
     * Move the card to the given position and hide it with a fade out effect.
     */
    moveAndHide(x: number, y: number, animationDuration: number) {
        this.moveTo(x, y, animationDuration, () => {
            this.hide();
            this.bitmap.alpha = 1;
        });

        createjs.Tween.get(this.bitmap).to(
            { alpha: 0 },
            animationDuration,
            createjs.Ease.cubicInOut
        );
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
        this.onClick(this, event.nativeEvent.button === 0);
    }

    show() {
        this.addToStage(this.bitmap); // to force it to up in the stack to be drawn on top of other stuff
        this.bitmap.visible = true;
        this.bitmap.alpha = 1;
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

    getX() {
        return this.bitmap.x;
    }

    getY() {
        return this.bitmap.y;
    }
}
