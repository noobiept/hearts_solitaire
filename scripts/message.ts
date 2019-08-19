import { Dialog, DialogPosition } from "@drk4/utilities";
import "@drk4/utilities/build/dialog.css";

let DIALOG;

export function init() {
    DIALOG = new Dialog({
        title: "",
        body: "",
        position: DialogPosition.bottomLeft,
        okButton: false,
        modal: false,
    });
}

export function open(title, text) {
    DIALOG.setTitle(title);
    DIALOG.setBody(text);
    DIALOG.open();
}

export function close() {
    DIALOG.close();
}
