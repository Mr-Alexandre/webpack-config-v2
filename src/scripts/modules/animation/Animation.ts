export enum EAnimationType {
    transition = 'transition',
    animation = 'animation',
}

type TAnimationConfig = {
    classPrefix?: string;
    mutableProperties?: Array<string>;
    animationType?: EAnimationType;
    hooks?: TAnimationHooks;
}

type TAnimationHooks = {
    beforeEnter?: (element: HTMLElement) => void;
    enter?: (element: HTMLElement) => void;
    afterEnter?: (element: HTMLElement) => void;
    enterCancelled?: (element: HTMLElement) => void;

    beforeLeave?: (element: HTMLElement) => void;
    leave?: (element: HTMLElement) => void;
    afterLeave?: (element: HTMLElement) => void;
    leaveCancelled?: (element: HTMLElement) => void;
}

type TAnimationExecuteHooks = {
    action?: (element: HTMLElement) => void;
    actionCanceled?: (element: HTMLElement) => void;
}

export function preparingForAnimation(
    element: HTMLElement,
    status: boolean,
    mutableProperties: Array<string>
): void {
    if (!element) {
        throw new Error('Element is not defined !');
    }
    if (status) {
        if ('willChange' in document.body.style) {
            element.style.willChange = String(mutableProperties.join(' ,'));
        } else {
            // element.style.cssText += 'transform: TranslateZ(0)';
        }
    } else {
        if ('willChange' in document.body.style) {
            element.style.willChange = '';
        }
    }
}

export default class Animation {
    constructor(
        private element: HTMLElement,
        private config?: TAnimationConfig
    ) {
        config.animationType = config.animationType || EAnimationType.transition;
        config.classPrefix = config.classPrefix || 'u-anim';
        config.mutableProperties = this.config.mutableProperties || ['auto'];
    }

    public toggleVisibility(type: boolean, visibleDisplay: string = 'block') {
        const typeClass: string = type ? 'enter' : 'leave';
        const display: string = type ? visibleDisplay : 'none';

        const handler: EventListener = () => {
            if (!type) {
                // leave
                this.element.style.display = display;
                // if (this.config.hooks && this.config.hooks.beforeEnter) {
                //     this.config.hooks.beforeEnter(this.element);
                // }
            }

            this.element.classList.remove(
                `${this.config.classPrefix}-${typeClass}-active`
            );
            this.element.classList.remove(
                `${this.config.classPrefix}-${typeClass}-to`
            );

            if (type && this.config?.hooks?.afterEnter) {
                // enter
                this.config.hooks.afterEnter(this.element);
            }
            if (!type && this.config?.hooks?.afterLeave) {
                // leave
                this.config.hooks.afterLeave(this.element);
            }

            this.element.removeEventListener(
                `${this.config.animationType}end`,
                handler
            );

            // clear will-change
            preparingForAnimation(
                this.element,
                false,
                this.config.mutableProperties
            );

            if (type && this.config?.hooks?.enterCancelled) {
                // enter
                this.config.hooks.enterCancelled(this.element);
            }
            if (!type && this.config?.hooks?.leaveCancelled) {
                // leave
                this.config.hooks.leaveCancelled(this.element);
            }
        };

        if (type && this.config?.hooks?.beforeEnter) {
            this.config.hooks.beforeEnter(this.element);
        }
        if (!type && this.config?.hooks?.beforeLeave) {
            // leave
            this.config.hooks.beforeLeave(this.element);
        }

        preparingForAnimation(
            this.element,
            true,
            this.config.mutableProperties
        );
        if (type) {
            // enter
            this.element.style.display = display;
        }

        this.element.classList.add(`${this.config.classPrefix}-${typeClass}`);
        if (type && this.config?.hooks?.enter) {
            this.config.hooks.enter(this.element);
        }
        if (!type && this.config?.hooks?.leave) {
            // leave
            this.config.hooks.leave(this.element);
        }

        window.requestAnimationFrame(() => {
            this.element.classList.add(
                `${this.config.classPrefix}-${typeClass}-active`
            );
            this.element.classList.add(
                `${this.config.classPrefix}-${typeClass}-to`
            );
            this.element.classList.remove(
                `${this.config.classPrefix}-${typeClass}`
            );
        });

        this.element.addEventListener(
            `${this.config.animationType}end`,
            handler
        );
    }

    public execute(options: TAnimationExecuteHooks): void {
        preparingForAnimation(
            this.element,
            true,
            this.config.mutableProperties
        );
        const handler = () => {
            preparingForAnimation(
                this.element,
                false,
                this.config.mutableProperties
            );
            if (options.actionCanceled) {
                options.actionCanceled(this.element);
            }
            this.element.removeEventListener(
                `${this.config.animationType}end`,
                handler
            );
        };
        window.requestAnimationFrame(() => {
            this.element.addEventListener(
                `${this.config.animationType}end`,
                handler
            );
            options.action(this.element);
        });
    }

    public updateElement(element: HTMLElement): Animation {
        this.element = element;
        return this;
    }
}
