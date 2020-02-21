import Animation, {AnimationType, preparingForAnimation} from '../animation/Animation';
import {freezeScroll} from '../../tools';
import {ClassScroll} from '../../variables';
import CreateEvent from '../event/Event';

export interface ModalHooks {
    beforeOpen?: () => void;
    open?: () => void;
    beforeClose?: () => void;
    close?: () => void;
}

export enum ModalType {
    custom,
    confirm,
    prompt,
}

export interface ModalOptions {
    animationClassPrefix?: string;
    dynamical?: boolean;
    hooks?: ModalHooks;
    type?: ModalType;
    hasBackdrop?: boolean;
    confirmCallback?: (result?: boolean, btn?: HTMLButtonElement) => boolean;
    promptCallback?<T>(data: T): T;
}

export interface ModalEventOptions {
    isCustom: boolean;
    isConfirm: boolean;
    confirmResult: boolean;
    isPrompt: boolean;
}

export default class Modal {
    private readonly CLASS_MODAL: string = 'js-modal';
    private readonly CLASS_CONTAINER: string = 'js-modalContainer';
    private readonly CLASS_CONTENT: string = 'js-modalContent';
    private readonly CLASS_MESSAGE: string = 'js-ModalMessage';
    private readonly CLASS_HEADER: string = 'js-modalHeader';
    private readonly CLASS_BODY: string = 'js-modalBody';
    private readonly CLASS_FOOTER: string = 'js-modalFooter';
    private readonly CLASS_MODAL_CLOSE: string = 'js-modalClose';
    private readonly CLASS_LOADER_ACTIVE: string = 'is-loading';
    private readonly CLASS_BTN_CONFIRM: string = 'js-modalBtnConfirm';

    private modalContainer: HTMLElement;
    private modalHeader: HTMLElement;
    private modalBody: HTMLElement;
    private modalFooter: HTMLElement;
    private modalMessage: HTMLElement;
    private modalContent: HTMLElement;
    private btnConfirm: HTMLButtonElement;

    private hasProcessOpening: boolean = false;

    private eventOptions: ModalEventOptions;

    private listener: EventListener;

    private animation: Animation;

    constructor(private modal: HTMLElement, private options?: ModalOptions) {
        if (this.options.dynamical) {
            return;
        }
        if (!modal) {
            throw new Error('Modal is not defined !');
        }
    }

    public init(): void {
        const defaultOptions: ModalOptions = {
            type: ModalType.custom,
            dynamical: false,
            animationClassPrefix: 'c-modal_animate',
            hasBackdrop: true,
        };
        this.options = {...defaultOptions, ...this.options};
        this.eventOptions = {
            isCustom: this.options.type === ModalType.custom,
            isConfirm: this.options.type === ModalType.confirm,
            confirmResult: undefined,
            isPrompt: this.options.type === ModalType.prompt,
        };
        this.searchAndSetModalElements();
        this.animation = this.createAnimation();

        this.attachEvent();
    }

    public dynamicalInit(modal: HTMLElement): void {
        if (!modal) {
            throw new Error('Modal is not defined !');
        }
        if (this.modal) {
            this.remove();
        }
        this.modal = modal;
        this.init();
    }

    public open(): void {
        this.hasProcessOpening = true;
        const event: boolean = this.createEvent(true);
        if (!event) {
            // is preventDefault
            return;
        }

        this.animation.toggleVisibility(true);
    }

    public close(): void {
        if (this.hasProcessOpening) {
            return;
        }

        let res: boolean = true;
        if (this.eventOptions.isConfirm) {
            res = this.options.confirmCallback(this.eventOptions.confirmResult, this.btnConfirm);
        }

        if (res) {
            this.animation.toggleVisibility(false);
            const event: boolean = this.createEvent(false);
            if (!event) {
                // is preventDefault
                return;
            }
        }
    }

    public getModalContainer(): HTMLElement {
        return this.modalContainer;
    }

    public getContent(): HTMLElement {
        return this.modalContent;
    }

    public getHeader(): HTMLElement {
        return this.modalHeader;
    }

    public getBody(): HTMLElement {
        return this.modalBody;
    }

    public getFooter(): HTMLElement {
        return this.modalFooter;
    }

    public getMessage(): HTMLElement {
        return this.modalMessage;
    }

    public setLoader(status: boolean): void {
        if (status) {
            this.modal.classList.add(this.CLASS_LOADER_ACTIVE);
        } else {
            this.modal.classList.remove(this.CLASS_LOADER_ACTIVE);
        }
    }

    public updateVar(): Modal {
        this.searchAndSetModalElements();
        return this;
    }

    private createAnimation(): Animation {
        return new Animation(this.modalContainer, {
            animationType: AnimationType.animation,
            classPrefix: this.options.animationClassPrefix,
            mutableProperties: ['transform', 'opacity'],
            hooks: {
                beforeEnter: () => {
                    if (this.options && this.options.hooks && this.options.hooks.beforeOpen) {
                        this.options.hooks.beforeOpen();
                    }
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, true, [
                            'background-color',
                        ]);
                    }
                    this.modal.style.display = 'block';
                    freezeScroll(true, ClassScroll.yNone);

                },
                enter: () => {
                    if (this.options.hasBackdrop) {
                        this.modal.classList.add('c-modal_backdrop');
                    }
                },
                enterCancelled: () => {
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, false, [
                            'background-color',
                        ]);
                    }
                    if (this.options && this.options.hooks && this.options.hooks.open) {
                        this.options.hooks.open();
                    }
                    this.hasProcessOpening = false;
                },
                beforeLeave: () => {
                    if (this.options && this.options.hooks && this.options.hooks.beforeClose) {
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
                        this.modal.classList.remove('c-modal_backdrop');
                    }
                },
                leaveCancelled: () => {
                    freezeScroll(false, ClassScroll.yNone);
                    if (this.options.hasBackdrop) {
                        preparingForAnimation(this.modal, false, [
                            'background-color',
                        ]);
                    }
                    this.modal.style.display = 'none';
                    if (this.options && this.options.hooks && this.options.hooks.close) {
                        this.options.hooks.close();
                    }
                },
            },
        });
    }

    private attachEvent(): void {
        this.listener = (event: Event) => {
            const element: HTMLElement = event.target as HTMLElement;
            if (element.closest(`.${this.CLASS_BTN_CONFIRM}`)) {
                event.preventDefault();
                if (this.options && this.options.type && this.options.type === ModalType.confirm) {
                    this.eventOptions.isConfirm = true;
                    this.eventOptions.confirmResult = true;
                }
                this.close();
            } else if (element.closest(`.${this.CLASS_MODAL_CLOSE}`) || element.classList.contains(this.CLASS_MODAL)) {
                if (this.options && this.options.type && this.options.type === ModalType.confirm) {
                    this.eventOptions.isConfirm = true;
                    this.eventOptions.confirmResult = false;
                }

                this.close();
            }
        };
        this.modal.addEventListener('click', this.listener);
    }

    private searchAndSetModalElements(): void {
        this.modalContainer = this.modal.querySelector(
            `.${this.CLASS_CONTAINER}`
        );
        if (!this.modalContainer) {
            throw new Error('Modal container is not defined !');
        }
        this.modalHeader = this.modal.querySelector(`.${this.CLASS_HEADER}`);
        this.modalBody = this.modal.querySelector(`.${this.CLASS_BODY}`);
        this.modalFooter = this.modal.querySelector(`.${this.CLASS_FOOTER}`);
        this.modalMessage = this.modal.querySelector(`.${this.CLASS_MESSAGE}`);
        this.modalContent = this.modal.querySelector(`.${this.CLASS_CONTENT}`);
        this.btnConfirm = this.modal.querySelector(`.${this.CLASS_BTN_CONFIRM}`);
    }

    private createEvent(state: boolean): boolean {
        let event: Event;
        if (state) {
            event = new CreateEvent('open').createCustom();
        } else {
            event = new CreateEvent('close').createCustom();
        }

        const canceled: boolean = !this.modal.dispatchEvent(event);
        return !canceled;
    }

    private remove(): void {
        this.modal.removeEventListener('click', this.listener);
    }

}
