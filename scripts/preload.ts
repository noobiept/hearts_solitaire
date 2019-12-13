export interface PreloadInitArgs {
    duringLoading: (progress: number) => void;
    onEnd: () => void;
}

let PRELOAD: createjs.LoadQueue;

export function init(args: PreloadInitArgs) {
    PRELOAD = new createjs.LoadQueue();
    PRELOAD.setMaxConnections(10);
    PRELOAD.maintainScriptOrder = false;

    const manifest = [
        { id: "card_back", src: "images/card_back_black.png" },

        { id: "ace_of_clubs", src: "images/ace_of_clubs.png" },
        { id: "two_of_clubs", src: "images/2_of_clubs.png" },
        { id: "three_of_clubs", src: "images/3_of_clubs.png" },
        { id: "four_of_clubs", src: "images/4_of_clubs.png" },
        { id: "five_of_clubs", src: "images/5_of_clubs.png" },
        { id: "six_of_clubs", src: "images/6_of_clubs.png" },
        { id: "seven_of_clubs", src: "images/7_of_clubs.png" },
        { id: "eight_of_clubs", src: "images/8_of_clubs.png" },
        { id: "nine_of_clubs", src: "images/9_of_clubs.png" },
        { id: "ten_of_clubs", src: "images/10_of_clubs.png" },
        { id: "jack_of_clubs", src: "images/jack_of_clubs2.png" },
        { id: "queen_of_clubs", src: "images/queen_of_clubs2.png" },
        { id: "king_of_clubs", src: "images/king_of_clubs2.png" },

        { id: "ace_of_diamonds", src: "images/ace_of_diamonds.png" },
        { id: "two_of_diamonds", src: "images/2_of_diamonds.png" },
        { id: "three_of_diamonds", src: "images/3_of_diamonds.png" },
        { id: "four_of_diamonds", src: "images/4_of_diamonds.png" },
        { id: "five_of_diamonds", src: "images/5_of_diamonds.png" },
        { id: "six_of_diamonds", src: "images/6_of_diamonds.png" },
        { id: "seven_of_diamonds", src: "images/7_of_diamonds.png" },
        { id: "eight_of_diamonds", src: "images/8_of_diamonds.png" },
        { id: "nine_of_diamonds", src: "images/9_of_diamonds.png" },
        { id: "ten_of_diamonds", src: "images/10_of_diamonds.png" },
        { id: "jack_of_diamonds", src: "images/jack_of_diamonds2.png" },
        { id: "queen_of_diamonds", src: "images/queen_of_diamonds2.png" },
        { id: "king_of_diamonds", src: "images/king_of_diamonds2.png" },

        { id: "ace_of_spades", src: "images/ace_of_spades.png" },
        { id: "two_of_spades", src: "images/2_of_spades.png" },
        { id: "three_of_spades", src: "images/3_of_spades.png" },
        { id: "four_of_spades", src: "images/4_of_spades.png" },
        { id: "five_of_spades", src: "images/5_of_spades.png" },
        { id: "six_of_spades", src: "images/6_of_spades.png" },
        { id: "seven_of_spades", src: "images/7_of_spades.png" },
        { id: "eight_of_spades", src: "images/8_of_spades.png" },
        { id: "nine_of_spades", src: "images/9_of_spades.png" },
        { id: "ten_of_spades", src: "images/10_of_spades.png" },
        { id: "jack_of_spades", src: "images/jack_of_spades2.png" },
        { id: "queen_of_spades", src: "images/queen_of_spades2.png" },
        { id: "king_of_spades", src: "images/king_of_spades2.png" },

        { id: "ace_of_hearts", src: "images/ace_of_hearts.png" },
        { id: "two_of_hearts", src: "images/2_of_hearts.png" },
        { id: "three_of_hearts", src: "images/3_of_hearts.png" },
        { id: "four_of_hearts", src: "images/4_of_hearts.png" },
        { id: "five_of_hearts", src: "images/5_of_hearts.png" },
        { id: "six_of_hearts", src: "images/6_of_hearts.png" },
        { id: "seven_of_hearts", src: "images/7_of_hearts.png" },
        { id: "eight_of_hearts", src: "images/8_of_hearts.png" },
        { id: "nine_of_hearts", src: "images/9_of_hearts.png" },
        { id: "ten_of_hearts", src: "images/10_of_hearts.png" },
        { id: "jack_of_hearts", src: "images/jack_of_hearts2.png" },
        { id: "queen_of_hearts", src: "images/queen_of_hearts2.png" },
        { id: "king_of_hearts", src: "images/king_of_hearts2.png" },

        { id: "pass_left", src: "images/pass_left.png" },
        { id: "pass_left_effect", src: "images/pass_left_effect.png" },
        { id: "pass_right", src: "images/pass_right.png" },
        { id: "pass_right_effect", src: "images/pass_right_effect.png" },
        { id: "pass_across", src: "images/pass_across.png" },
        { id: "pass_across_effect", src: "images/pass_across_effect.png" },
    ];

    PRELOAD.addEventListener("progress", function(
        event: createjs.ProgressEvent
    ) {
        args.duringLoading((event.progress * 100) | 0);
    } as any);
    PRELOAD.addEventListener("complete", args.onEnd);
    PRELOAD.loadManifest(manifest, true);
}

/**
 * Get a previously loaded asset.
 */
export function getAsset(id: string) {
    return PRELOAD.getResult(id) as HTMLImageElement;
}
