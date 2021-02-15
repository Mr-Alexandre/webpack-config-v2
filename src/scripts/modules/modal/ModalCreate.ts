import {convertStringToHTMML, isHTMLElement} from "../../tools";
import Modal, {TModalOptions} from "./Modal";
import ModalConfirm, {ModalConfirmOptions} from "./ModalConfirm";

export interface ModalCreateOptions {
    template?: string | HTMLElement;
}

export default class ModalCreate {

    constructor(private options?: ModalCreateOptions) {
    }

    createDefault(options?: TModalOptions): Modal {
        const modalElRef: HTMLElement = this.createModal(this.options?.template);
        return new Modal(modalElRef, options);
    }

    createConfirm(options?: ModalConfirmOptions): ModalConfirm {
        const modalElRef: HTMLElement = this.createModal(this.options?.template);
        return new ModalConfirm(modalElRef, options);
    }

    private createModal(template?: string | HTMLElement): HTMLElement {
        const tmp: string = `
            <dialog class="js-modal c-modal">
              <div class="js-modalContainer c-modal__container">
                <div class="js-modalClose c-modal__icon-close">
                    <i>Close</i>
                </div>
                <div class="js-modalContent c-modal__content">
                    <p>this modal is created dynamically</p>
                    <footer>
                        <button class="js-modalClose">Close</button>
                    </footer>
                </div>
              </div>
            </dialog>
        `;
        if (template) {
            if (isHTMLElement(template)) {
                return document.body.appendChild((template as HTMLElement).cloneNode(true) as HTMLElement);
            } else {
                return document.body.appendChild(convertStringToHTMML(template as string));
            }
        } else {
            return document.body.appendChild(convertStringToHTMML(tmp));
        }

    }
}
