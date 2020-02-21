import HttpClient from "../../scripts/modules/http/HttpClient";
import {globalEventDelegate} from "../../scripts/tools";

export default class Example {
    private http: HttpClient;

    constructor(private api: string, private method: string, private outElem: HTMLElement) {
        this.http = new HttpClient();
    }

    public init(): void {
        globalEventDelegate('click', `#exapmleSendRequest`, () => {
            this.send()
        });
    }

    private send(data: string = null) {
        this.http.post(this.api, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
            .then((response) => {
                return response.text();
            })
            .then((response) => {
                this.outElem.innerHTML = response;
            })
    }
}
