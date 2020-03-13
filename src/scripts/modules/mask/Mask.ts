//from - https://unmanner.github.io/imaskjs/guide.html#support-older
import IMask from 'imask';

interface MaskFormats {
    [format: string]: MaskFormat;
}

interface MaskFormat {
    placeholder: string;
    class: string;
    option: IMask.AnyMaskedOptions;
}

export const maskFormats: MaskFormats = {
    phone: {
        placeholder: '+7 (xxx) xxx-xx-xx',
        class: 'js-maskPhone',
        option: {
            mask: '{+7} (000) 000-00-00',
            lazy: true,
            placeholderChar: 'x',
        },
    },
    date: {
        placeholder: '',
        class: 'js-maskDate',
        option: {
            mask: Date,
            overwrite: true,
            autofix: true,
            min: new Date(1500, 0, 1),
            max: new Date(9999, 0, 1),
        },
    },
    iin: {
        placeholder: '',
        class: 'js-maskIin',
        option: {
            mask: '00000000000000',
        },
    },
    visaCard: {
        placeholder: '0000 0000 0000 0000',
        class: 'js-maskVisaCard',
        option: {
            mask: '0000 0000 0000 0000',
        },
    },
    passport: {
        placeholder: '',
        class: 'js-maskPassport',
        option: {
            mask: '000000000000',
        },
    },
    idCard: {
        placeholder: '',
        class: 'js-maskIdCard',
        option: {
            mask: '0000000',
        },
    },
    number: {
        placeholder: '',
        class: 'js-maskNumber',
        option: {
            mask: /^\d+$/,
        },
    },
    smsCode: {
        placeholder: '',
        class: 'js-maskSMSCode',
        option: {
            mask: /^\d+$/,
        },
    },
    numberLatinUpper: {
        placeholder: '',
        class: 'js-maskNumberLatinUpper',
        option: {
            mask: /^[A-z0-9]+$/,
            prepare: function (value: string) {
                return value.toUpperCase();
            },
        },
    },
    latinUpper: {
        placeholder: '',
        class: 'js-maskLatinUpper',
        option: {
            mask: /^[A-z]+$/,
            prepare: function (value: string) {
                return value.toUpperCase();
            },
        },
    },
};

export default class Mask {
    private mutationObserver: MutationObserver;

    private mutationObserverListener: MutationCallback = (events: MutationRecord[]) => {
        events.forEach(event => {
            this.activate(event.target as HTMLElement);
        })
    };

    constructor(private formats: MaskFormats) {
    }

    public init(): void {
        this.activate();
        this.autoActivate()
    }

    private autoActivate(): void {
        if (!this.mutationObserver) {
            this.mutationObserver = new MutationObserver(this.mutationObserverListener);
            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true,
            });
        }
    }

    private activate(scope: HTMLElement = document.body): void {
        for (let key in this.formats) {
            const fields: HTMLCollectionOf<Element> = scope.getElementsByClassName(this.formats[key].class);
            for (let i = 0, len = fields.length; i < len; i++) {
                IMask(
                    fields.item(i) as HTMLInputElement,
                    this.formats[key].option,
                );
                // (fields.item(i) as HTMLInputElement).placeholder = this.formats[
                //     key
                // ].placeholder;
            }
        }
    }
}
