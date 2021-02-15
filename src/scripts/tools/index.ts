export interface LooseObject {
    [key: string]: any;
}

export function getIndexElement(
    container: HTMLElement,
    element: HTMLElement,
): number {
    const containerArray: Array<HTMLElement> = [].slice.call(
        container.children,
    );
    return containerArray.indexOf(element, 0);
}

export function definitionElementOnClick(
    event: Event,
    selector: string,
): Element {
    return (event.target as Element).closest(`${selector}`);
}

export function globalEventDelegate<E extends Event>(
    event: string,
    selector: string,
    callbackSuccess: (element: HTMLElement, event: E) => void,
    callbackFailed?: (element: HTMLElement, event: E) => void,
): void {
    const listener: EventListener = (ev: E) => {
        const element: Element = definitionElementOnClick(ev, selector);

        if (element) {
            callbackSuccess(element as HTMLElement, ev);
            return;
        } else if (callbackFailed) {
            callbackFailed(ev.target as HTMLElement, ev);
        }
    };

    if (event === 'click' && 'ontouchstart' in document.documentElement) {
        let moveCount: number = 0;
        let move: boolean = false;
        let click: boolean = false;

        const touchStartListener: EventListener = () => {
            click = true;
        };
        const touchMoveListener: EventListener = () => {
            moveCount++;
            move = true;
        };
        const touchEndListener: EventListener = (ev: E) => {
            if (!move && click) {
                listener(ev);
            }
            move = false;
            moveCount = 0;
            click = false;
        };
        addEventListener('touchstart', touchStartListener, false);
        addEventListener('touchmove', touchMoveListener, false);
        addEventListener('touchend', touchEndListener, false);
    } else {
        addEventListener(event, listener);
    }
}

export function getAttributesElement(
    element: HTMLElement | Element,
): LooseObject {
    const obj: LooseObject = {};

    if (element.hasAttributes()) {
        const attr = element.attributes;

        for (let i = 0, len = attr.length; i < len; i++) {
            obj[attr[i].nodeName] = attr[i].nodeValue;
        }

        return obj;
    }

    return null;
}

export function debounce<F extends (...params: Array<any>) => void>(
    context: any,
    func: F,
    delay: number,
) {
    let timeoutID: number = null;
    return (...args: Array<any>) => {
        clearTimeout(timeoutID);
        timeoutID = window.setTimeout(() => func.apply(context, args), delay);
    };
}

export function freezeScroll(state: boolean, classFreeze: string): void {
    const widthScroll: number =
        window.innerWidth - document.documentElement.clientWidth;
    if (state) {
        // document.body.classList.add(classFreeze);
        // document.body.style.paddingRight = `${widthScroll}px`;
    } else {
        // document.body.classList.remove(classFreeze);
        // document.body.style.paddingRight = '';
    }
}

export function getExtensionFiles(str: string): string {
    return str.match(/\.([^.]*?)(?=\?|#|$)/)[1];
}

export function getSpecificFirstLevelChildren(parent: HTMLElement, className: string): Array<Element> {
    const children: Array<Element> = Array.from(parent.children);
    return children.filter((element: Element) => {
        return element.classList.contains(className);
    });
}

export function isSupportTouch() {
    try {
        document.createEvent('TouchEvent');
        return true;
    } catch (e) {
        return false;
    }
}

export function secondsToFullTime(sec: number) {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor(sec / 60) % 60;
    const seconds = sec % 60;

    return [hours, minutes, seconds]
        .map((v) => v < 10 ? '0' + v : v)
        .filter((v, i) => v !== '00' || i > 0)
        .join(':');
}


export function getCookie(name: string) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}


interface SetCookieOptions {
    [key: string]: any
}

export function setCookie(name: string, value: string, options?: SetCookieOptions) {

    options = {
        path: '/',
        ...options
    };

    if (options && options.expires.toUTCString) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function deleteCookie(name: string) {
    setCookie(name, "", {
        'max-age': -1
    })
}

export function convertStringToHTMML(pseudoHTML: string): HTMLElement {
    const ghostDiv: HTMLElement = document.createElement('div');
    ghostDiv.innerHTML = pseudoHTML;
    return ghostDiv.firstElementChild as HTMLElement;
}

export function strToBoolean(val: string) {
    return !!JSON.parse(String(val).toLowerCase());
}

export function isHTMLElement(element: any) {
    try {
        //Using W3 DOM2 (works for FF, Opera and Chrome)
        return element instanceof HTMLElement;
    } catch (e) {
        //Browsers not supporting W3 DOM2 don't have HTMLElement and
        //an exception is thrown and we end up here. Testing some
        //properties that all elements have (works on IE7)
        return (typeof element === "object") &&
            (element.nodeType === 1) && (typeof element.style === "object") &&
            (typeof element.ownerDocument === "object");
    }
}
