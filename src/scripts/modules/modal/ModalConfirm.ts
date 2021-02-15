import Modal, {TModalOptions} from "./Modal";

export interface ModalConfirmOptions extends TModalOptions {
    onAccept?: (btn: HTMLButtonElement) => void,
    onReject?: (btn: HTMLButtonElement) => void,
}

export default class ModalConfirm extends Modal {
    private readonly CLASS_BTN_ACCEPT: string = 'js-modalBtnAccept';
    private readonly CLASS_BTN_REJECT: string = 'js-modalBtnReject';

    protected options: ModalConfirmOptions;

    private listenerBtn: EventListener;

    constructor(modal: HTMLElement, options?: ModalConfirmOptions) {
        super(modal, options);
    }

    private attachEventOnBtn(): void {
        this.listenerBtn = (event: Event) => {
            const element: HTMLElement = event.target as HTMLElement;
            if (element.closest(`.${this.CLASS_BTN_ACCEPT}`)) {
                if (this.options?.onAccept) {
                    this.options.onAccept(element as HTMLButtonElement);
                }
            } else if (element.closest(`.${this.CLASS_BTN_REJECT}`)) {
                if (this.options?.onReject) {
                    this.options.onReject(element as HTMLButtonElement);
                }
            }
        };
        this.modal.addEventListener('click', this.listenerBtn);
    }

    private setConfig(): void {
        this.options.closable = false;
        this.options.backdropClosable = false;
    }

    protected init(): void {
        super.init();
        this.attachEventOnBtn();
        this.setConfig();
    }

    public destroy(): void {
        this.modal.removeEventListener('click', this.listenerBtn);
        super.destroy();
    }
}

