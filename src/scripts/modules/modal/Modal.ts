import Animation, {EAnimationType, preparingForAnimation} from '../animation/Animation';
import CreateEvent from '../event/CreateEvent';
import FreezingScroll from "../scroll/FreezingScroll";

export type TModalHooks = {
    beforeOpen?: () => void;
    open?: () => void;
    beforeClose?: () => void;
    close?: () => void;
}

export type TModalOptions = {
    animationClassPrefix?: string;
    animationMutableProperties?: Array<string>;
    backdropClass?: string;
    hooks?: TModalHooks;
    hasBackdrop?: boolean;
    closable?: boolean;
    backdropClosable?: boolean;
    freezeScroll?: boolean;
}

export default class Modal {
    private readonly CLASS_MODAL: string = 'js-modal';
    private readonly CLASS_CONTAINER: string = 'js-modalContainer';
    private readonly CLASS_CONTENT: string = 'js-modalContent';
    private readonly CLASS_CLOSE: string = 'js-modalClose';

    private modalContainer: HTMLElement;
    private modalContent: HTMLElement;
    private animation: Animation;
    private isProcessOpening: boolean = false;
    private isVisible: boolean = false;

    private freezingScroll: FreezingScroll;

    constructor(protected modal: HTMLElement, protected options?: TModalOptions) {
        if (!modal) {
            throw new Error('Modal is not defined !');
        }
        this.init();
    }

    public open(): void {
        const event: boolean = this.createEvent(true);
        if (!event || this.isVisible) {
            // is preventDefault
            return;
        }
        this.isProcessOpening = true;
        this.animation.toggleVisibility(true);
        this.isVisible = true;
        this.freezingScroll.freeze();
    }

    public close(): void {
        if (this.isProcessOpening) {
            return;
        }
        const event: boolean = this.createEvent(false);
        if (!event || !this.isVisible) {
            // is preventDefault
            return;
        }
        this.animation.toggleVisibility(false);
        this.isVisible = false;
        this.freezingScroll.unfreeze();
    }

    public getContent(): HTMLElement {
        return this.modalContent;
    }

    public destroy(): void {
        this.removeEventOnClose();
        this.modal.remove();
    }

    protected init(): void {
        this.freezingScroll = new FreezingScroll();
        const defaultOptions: TModalOptions = this.getDefaultOptions();
        this.options = {...defaultOptions, ...this.options};
        this.searchAndSetModalElements();
        this.animation = this.createAnimation();
        this.attachEventOnClose();
    }

    private getDefaultOptions(): TModalOptions {
        return {
            animationClassPrefix: 'c-modal-animate',
            animationMutableProperties: ['transform', 'opacity'],
            backdropClass: 'c-modal_backdrop',
            hasBackdrop: true,
            closable: true,
            backdropClosable: true,
            freezeScroll: true,
        };
    }

    private createAnimation(): Animation {
        return new Animation(this.modalContainer, {
            animationType: EAnimationType.animation,
            classPrefix: this.options.animationClassPrefix,
            mutableProperties: this.options.animationMutableProperties,
            hooks: {
                beforeEnter: () => {
                    if (this.options?.hooks?.beforeOpen) {
                        this.options.hooks.beforeOpen();
                    }
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, true, [
                            'background-color',
                        ]);
                    }
                    this.modal.style.display = 'block';
                },
                enter: () => {
                    if (this.options.hasBackdrop) {
                        this.modal.classList.add(this.options.backdropClass);
                    }
                },
                enterCancelled: () => {
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, false, [
                            'background-color',
                        ]);
                    }
                    if (this.options?.hooks?.open) {
                        this.options.hooks.open();
                    }
                    this.isProcessOpening = false;
                },
                beforeLeave: () => {
                    if (this.options?.hooks?.beforeClose) {
                        this.options.hooks.beforeClose();
                    }
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, true, [
                            'background-color',
                        ]);
                    }
                },
                leave: () => {
                    if (this.options.hasBackdrop) {
                        this.modal.classList.remove(this.options.backdropClass);
                    }
                },
                leaveCancelled: () => {
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, false, [
                            'background-color',
                        ]);
                    }
                    this.modal.style.display = 'none';
                    if (this.options?.hooks?.close) {
                        this.options.hooks.close();
                    }
                },
            },
        });
    }

    private listenerClose: EventListener = (event: Event) => {
        const element: HTMLElement = event.target as HTMLElement;
        if (element.closest(`.${this.CLASS_CLOSE}`)) {
            if (!this.options.closable) {
                return;
            }
            this.close();
        } else if (element.classList.contains(this.CLASS_MODAL)) {
            if (!this.options.backdropClosable) {
                return;
            }
            this.close();
        }
    };

    private attachEventOnClose(): void {
        this.modal.addEventListener('click', this.listenerClose);
    }

    private removeEventOnClose(): void {
        this.modal.removeEventListener('click', this.listenerClose);
    }

    private searchAndSetModalElements(): void {
        this.modalContainer = this.modal.querySelector(`.${this.CLASS_CONTAINER}`);
        if (!this.modalContainer) {
            throw new Error('Modal container is not defined !');
        }
        this.modalContent = this.modal.querySelector(`.${this.CLASS_CONTENT}`);
    }

    private createEvent(state: boolean): boolean {
        let event: Event;
        if (state) {
            event = new CreateEvent('open').createCustom();
        } else {
            event = new CreateEvent('close').createCustom();
        }
        return this.modal.dispatchEvent(event);
    }

}
