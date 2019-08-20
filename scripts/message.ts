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

export function open(title: string, body: string) {
    DIALOG.setTitle(title);
    DIALOG.setBody(body);
    DIALOG.open();
}

export function close() {
    DIALOG.close();
}

/**
 * Open a modal dialog on the center of the screen that needs to be dealt with.
 */
export function openModal(title: string, body: string, onClose: () => void) {
    const dialog = new Dialog({
        title,
        body,
        onClose,
    });
    dialog.open();
}
