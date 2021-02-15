import Animation, {EAnimationType} from "../../animation/Animation";
import {ITabsExtension, TTabsState} from "../models";
import Tabs from "../Tabs";

export type TTabsAnimationUnderlineOptions = {
    classForDynamicElements: {
        underline: string;
    },
};

export default class TabsAnimationUnderline implements ITabsExtension {
    private CLASS_UNDERLINE: string = 'js-tabsHeaderUnderline';

    private animation: Animation;

    private tabsInstance: Tabs;
    private underline: HTMLElement;

    constructor(private options?: TTabsAnimationUnderlineOptions) {
        this.options = {
            ...this.getDefaultOptions(),
            ...options,
        };
    }

    public create(instance: Tabs, info: TTabsState) {
        this.tabsInstance = instance;
        this.underline = this.createUnderline(instance.getElements().header);
        this.init();
        this.animateUnderline(this.underline, info.tab);
    };

    public beforeToggle(info: TTabsState) {
        this.animateUnderline(this.underline, info.tab);
    };

    public toggle(info: TTabsState) {
    };

    public destroy() {
    };

    private getDefaultOptions(): TTabsAnimationUnderlineOptions {
        return {
            classForDynamicElements: {
                underline: ''
            }
        };
    }

    private animateUnderline(underline: HTMLElement, regardingWhom: HTMLElement): void {
        this.animation.execute({
            action: () => {
                this.setPosition(underline, regardingWhom);
            },
        });
    }

    private setPosition(underline: HTMLElement, regardingWhom: HTMLElement): void {
        underline.style.width = `${regardingWhom.offsetWidth}px`;
        underline.style.transform = `translateX(${regardingWhom.offsetLeft}px)`;
    }

    private createUnderline(header: HTMLElement): HTMLElement {
        const underline: HTMLElement = document.createElement('div');
        underline.classList.add(this.CLASS_UNDERLINE);
        if (this.options.classForDynamicElements.underline) {
            underline.classList.add(this.options.classForDynamicElements.underline);
        }
        return header.appendChild(underline);
    }

    private init(): void {
        this.animation = new Animation(this.underline, {
            animationType: EAnimationType.transition,
            mutableProperties: ['width', 'transform'],
        });
    }
}
