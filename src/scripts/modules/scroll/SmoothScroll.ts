import {globalEventDelegate} from '../../tools';

export default class SmoothScroll {
    private CLASS_HANDLER: string = 'js-smoothScroll';
    private DATA_ATTR_ELEMENT_ID: string = 'data-smooth-scroll-id';

    constructor(handler?: string, private options?: ScrollIntoViewOptions) {
        if (handler) {
            this.CLASS_HANDLER = handler;
        }
    }

    public init(): void {
        this.attachEvent();
    }

    public scrollTo(element: HTMLElement): void {
        element.scrollIntoView({...{
                behavior: 'smooth',
            }, ...this.options});
    }

    private attachEvent(): void {
        globalEventDelegate('click', `.${this.CLASS_HANDLER}`, (mover: HTMLElement) => {
            this.scrollBy(mover);
        });
    }

    private scrollBy(mover: HTMLElement): void {
        const itemId: string = mover.getAttribute(this.DATA_ATTR_ELEMENT_ID);

        if (itemId) {
            const anchor: HTMLElement = document.getElementById(itemId);

            if (anchor) {
                anchor.scrollIntoView({...{
                    behavior: 'smooth',
                }, ...this.options});
            }
        }
    }
}
