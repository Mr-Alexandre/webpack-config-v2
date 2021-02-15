import Tabs from "./Tabs";

export type TTabsHooks = {
    create?: (info: TTabsState) => void;
    beforeToggle?: (info: TTabsState) => void;
    toggle?: (info: TTabsState) => void;
    destroy?: () => void;
}

export type TTabsOptions = {
    classTabActive?: string;
    classItemActive?: string;
    hooks?: TTabsHooks;
    extensions?: Array<ITabsExtension>;
}

export type TTabsState = {
    tab: HTMLElement;
    prevTab: HTMLElement;
    item: HTMLElement;
    prevItem: HTMLElement;
    index: number;
    prevIndex: number;
}

export type TTabsElements = {
    header: HTMLElement;
    nav: HTMLElement;
    contents: HTMLElement;
}

export interface ITabsExtension {
    create: (instance: Tabs, info: TTabsState) => void;
    beforeToggle: (info: TTabsState) => void;
    toggle: (info: TTabsState) => void;
    destroy: () => void;
}
