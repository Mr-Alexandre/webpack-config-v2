import axios, {AxiosPromise, AxiosResponse} from 'axios';

export interface Response extends AxiosResponse{}

export default class Example {


    constructor(private api: string, private method: string, private outElem: HTMLElement) {

    }

    public send(data: string): void {
        axios({
            url: this.api,
            method: this.method,
            data: data,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        })
        .then((data: Response) => {
            this.outElem.innerHTML = data.data;
        })
    }
}