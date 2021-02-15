import {globalEventDelegate} from '../tools';
import HttpClient from "../modules/http/HttpClient";

interface SendRequestOptions {
    success: () => void;
}

export default class SendRequest {
    private CLASS_HANDLER: string = 'js-sendRequestHandler';
    private CLASS_FORM: string = 'js-sendRequestForm';
    private CLASS_SCOPE: string = 'js-sendRequestScope';
    private CLASS_LOADING: string = 'is-loading';
    private http: HttpClient;

    constructor(handler?: string, private option?: SendRequestOptions) {
        if (handler) {
            this.http = new HttpClient();
            this.CLASS_HANDLER = handler;
        }
    }

    public init(): void {
        this.attachEvent();
    }

    private attachEvent(): void {
        globalEventDelegate('click', `.${this.CLASS_HANDLER}`, (btn: HTMLButtonElement, event: Event) => {
            event.preventDefault();
            if (btn.classList.contains(this.CLASS_LOADING)) {
                return;
            }
            const scope: HTMLElement = btn.closest(`.${this.CLASS_SCOPE}`) as HTMLElement;
            let form: HTMLFormElement;
            if (scope.classList.contains(this.CLASS_FORM)) {
                form = scope as HTMLFormElement;
            } else {
                form = scope.querySelector(`.${this.CLASS_FORM}`);
            }
            this.send(form, btn);
        });
    }

    private send(form: HTMLFormElement, btn: HTMLButtonElement): void {
        btn.disabled = true;
        btn.classList.add(this.CLASS_LOADING);
        this.http.post(form.action, new FormData(form))
            .then((response) => {
                if (this.option && this.option.success) {
                    this.option.success();
                }
                btn.disabled = false;
                btn.classList.remove(this.CLASS_LOADING);
            })
            .catch((reject) => {
                console.log(reject);
            });
    }
}
