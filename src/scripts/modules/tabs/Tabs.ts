import CreateEvent from "../event/CreateEvent";
import {getIndexElement} from "../../tools";
import {TTabsElements, TTabsOptions, TTabsState} from "./models";

export default class Tabs {
    public static readonly CLASS_TABS: string = 'js-tabs';
    public static readonly CLASS_HEADER: string = 'js-tabsHeader';
    public static readonly CLASS_NAV: string = 'js-tabsNav';
    public static readonly CLASS_TAB: string = 'js-tabsTab';
    public static readonly CLASS_CONTENT: string = 'js-tabsContent';
    public static readonly CLASS_ITEM: string = 'js-tabsItem';

    public static readonly DATA_ATTR_ACTIVATE: string = 'data-activate';

    private static mutationObserver: MutationObserver;

    private static mutationObserverListener = (uniqueClass?: string) => {
        return (events: MutationRecord[]) => {
            events.forEach(event => {
                Tabs.searchAndActivate(event.target as HTMLElement, uniqueClass);
            })
        }
    };

    private header: HTMLElement;
    private nav: HTMLElement;
    private contents: HTMLElement;

    constructor(private tabs: HTMLElement, protected options?: TTabsOptions) {
        if (!tabs) {
            throw new Error('Tabs is not defined !');
        }
        this.options = {
            ...this.getDefaultOptions(),
            ...options,
        };
        this.init();
    }

    static autoInit(uniqueClass?: string): void {
        if (!Tabs.mutationObserver) {
            Tabs.mutationObserver = new MutationObserver(Tabs.mutationObserverListener(uniqueClass));
            Tabs.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
        Tabs.searchAndActivate(document.body, uniqueClass);
    }

    public toggleByIndex(index: number): void {
        const countItems: number = this.tabs.children.length - 1;
        if (index > countItems || index < countItems) {
            throw new Error('index out of range !');
        }
        const tab: HTMLElement = this.nav.children.item(index) as HTMLElement;
        if (tab) {
            this.toggle(tab)
        } else {
            throw new Error('tab is not defined !')
        }
    }

    public destroy(): void {
        if (this.options?.hooks?.destroy) {
            this.options.hooks.destroy();
            this.options.extensions.forEach(extension => {
                extension.destroy();
            })
        }
        this.tabs.removeEventListener('click', this.eventListener);
        this.tabs.removeAttribute(Tabs.DATA_ATTR_ACTIVATE);
        this.tabs.remove();
    }

    public getElements(): TTabsElements {
        return {
            header: this.header,
            nav: this.nav,
            contents: this.contents,
        }
    }

    private static searchAndActivate(scope: HTMLElement, uniqueClass: string = ''): void {
        uniqueClass = uniqueClass ? '.'+uniqueClass : uniqueClass;
        const selector: string = `.${Tabs.CLASS_TABS}${uniqueClass}:not([${Tabs.DATA_ATTR_ACTIVATE}="true"])`;
        const tabsElements: Array<HTMLElement> = Array.from(scope.querySelectorAll(selector));
        if (scope.classList.contains(Tabs.CLASS_TABS) && !scope.getAttribute(Tabs.DATA_ATTR_ACTIVATE)) {
            tabsElements.push(scope)
        }
        tabsElements.forEach(tabs => {
            new Tabs(tabs);
        });
    }

    private init(): void {
        this.searchElement();
        this.attachEvent();
        this.tabs.setAttribute(Tabs.DATA_ATTR_ACTIVATE, 'true');


        const tab: HTMLElement = this.nav.querySelector(`.${this.options.classTabActive}`);
        const info: TTabsState = this.getState(tab);
        if (this.options?.hooks?.create) {
            this.options.hooks.create(info);
        }
        this.options.extensions.forEach(extension => {
            extension.create(this, info);
        })
    }

    private getDefaultOptions(): TTabsOptions {
        return {
            classTabActive: 'is-active',
            classItemActive: 'is-active',
            extensions: [],
        };
    }

    private searchElement(): void {
        this.header = this.tabs.querySelector(`.${Tabs.CLASS_HEADER}`);
        this.nav = this.tabs.querySelector(`.${Tabs.CLASS_NAV}`);
        this.contents = this.tabs.querySelector(`.${Tabs.CLASS_CONTENT}`);
    }

    private eventListener: EventListener = (event: Event) => {
        const element: HTMLElement = event.target as HTMLElement;
        const tab: HTMLElement = element.closest(`.${Tabs.CLASS_TAB}`);
        if (tab) {
            this.toggle(tab);
        }
    };

    private isActive(tab: HTMLElement): boolean {
        return tab.classList.contains(this.options.classTabActive);
    }

    private attachEvent(): void {
        this.tabs.addEventListener('click', this.eventListener);
    }

    private toggle(tab: HTMLElement): void {
        if (this.isActive(tab)) {
            return;
        }

        const event: boolean = this.createEvent();
        if (!event) {
            // is preventDefault
            return;
        }

        const {index, prevTab, prevIndex, item, prevItem} = this.getState(tab);

        const info: TTabsState = {
            tab,
            prevTab,
            item,
            prevItem,
            index,
            prevIndex,
        };

        if (this.options?.hooks?.beforeToggle) {
            this.options.hooks.beforeToggle(info);
        }
        this.options.extensions.forEach(extension => {
            extension.beforeToggle(info);
        });

        tab.classList.add(this.options.classItemActive);
        prevTab.classList.remove(this.options.classItemActive);
        item.classList.add(this.options.classTabActive);
        prevItem.classList.remove(this.options.classTabActive);

        if (this.options?.hooks?.toggle) {
            this.options.hooks.toggle(info);
        }
        this.options.extensions.forEach(extension => {
            extension.toggle(info);
        })
    }

    private getState(tab: HTMLElement): TTabsState {
        const index: number = getIndexElement(this.nav, tab);

        const prevTab: HTMLElement = this.nav.querySelector(`.${this.options.classTabActive}`);
        const prevIndex: number = getIndexElement(this.nav, prevTab);
        const item: HTMLElement = this.contents.children.item(index) as HTMLElement;
        const prevItem: HTMLElement = this.contents.querySelector(`.${this.options.classItemActive}`);

        return {
            tab,
            prevTab,
            item,
            prevItem,
            index,
            prevIndex,
        }
    }

    private createEvent(): boolean {
        let event: Event = new CreateEvent('toggle').createCustom();
        return this.tabs.dispatchEvent(event);
    }
}
