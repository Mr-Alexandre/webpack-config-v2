export enum AnimationType {
    transition = 'transition',
    animation = 'animation',
}

interface AnimationConfig {
    classPrefix?: string;
    mutableProperties?: Array<string>;
    animationType?: AnimationType;
    hooks?: AnimationHooks;
}

interface AnimationHooks {
    beforeEnter?: (element: HTMLElement) => void;
    enter?: (element: HTMLElement) => void;
    afterEnter?: (element: HTMLElement) => void;
    enterCancelled?: (element: HTMLElement) => void;

    beforeLeave?: (element: HTMLElement) => void;
    leave?: (element: HTMLElement) => void;
    afterLeave?: (element: HTMLElement) => void;
    leaveCancelled?: (element: HTMLElement) => void;
}

interface AnimationExecuteHooks {
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
        private config?: AnimationConfig
    ) {
        config.animationType = config.animationType || AnimationType.transition;
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

            if (type && this.config.hooks && this.config.hooks.afterEnter) {
                // enter
                this.config.hooks.afterEnter(this.element);
            }
            if (!type && this.config.hooks && this.config.hooks.afterLeave) {
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

            if (type && this.config.hooks && this.config.hooks.enterCancelled) {
                // enter
                this.config.hooks.enterCancelled(this.element);
            }
            if (
                !type &&
                this.config.hooks &&
                this.config.hooks.leaveCancelled
            ) {
                // leave
                this.config.hooks.leaveCancelled(this.element);
            }
        };

        if (type && this.config.hooks && this.config.hooks.beforeEnter) {
            this.config.hooks.beforeEnter(this.element);
        }
        if (!type && this.config.hooks && this.config.hooks.beforeLeave) {
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
        if (type && this.config.hooks && this.config.hooks.enter) {
            this.config.hooks.enter(this.element);
        }
        if (!type && this.config.hooks && this.config.hooks.leave) {
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

    public execute(options: AnimationExecuteHooks): void {
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
/*
Схема работы (как во VueJS and AngularJs)
Классы переходов
Есть шесть классов, применяющихся в анимациях появления и исчезновения элементов:
-enter: Означает начало анимации появления элемента. Этот класс добавляется перед вставкой элемента, а удаляется в следующем фрейме после вставки.
-enter-active: Означает, что анимация появления элемента активна. Этот класс остаётся в течение всей анимации. Он добавляется перед вставкой элемента,
    а удаляется как только переход или анимация прекратились. Используйте его для установки длительности, задержки и плавности (easing curve) анимации появления.
-enter-to: Означает, что анимация появления элемента завершается. Класс добавляется в следующем фрейме после вставки элемента
    (тогда же, когда будет удалён -enter ), удаляется после завершения перехода или анимации.
-leave: Означает начало анимации исчезновения элемента. Класс добавляется как только началась анимация исчезновения, а удаляется в следующем фрейме после этого.
-leave-active: Означает, что анимация исчезновения элемента активна. Этот класс остаётся в течение всей анимации. Он добавляется как только начинается анимация
    исчезновения, а удаляется как только переход или анимация прекратились. Используйте его для установки длительности, задержки и плавности (easing curve) анимации исчезновения.
-leave-to: Означает, что анимация исчезновения элемента завершается. Класс добавляется в следующем фрейме после начала анимации
    исчезновения (тогда же, когда будет удалён -leave), а удаляется после завершения перехода или анимации.
Пример:
    .fa-enter{
        opacity: 0;
    }
    .fa-enter-active{
        transition: opacity .5s;
    }
    .fa-enter-to{
    }

    .fa-leave-active{
        transition: opacity .5s;
    }
    .fa-leave-to{
        opacity: 0;
    }
    .fa-leave{
    }
Внимание ! если вы используете анимацию css только на @keyframes, то для работы ее необходимо размещать в:
    .fa-enter, .fa-enter-active{
        animation: niceIn 0.5s linear;
    }
    .fa-leave-active{
        animation: niceOut reverse 0.5s linear;  !!!reverse указывайте в том случае, если у вас один @keyframes, и вы хотите что-бы он сделал то же но на оборот
    }

*/
