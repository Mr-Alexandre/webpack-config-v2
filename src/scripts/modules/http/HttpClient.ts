export interface HttpClientOptions {
    headers?: HeadersInit;
    mode?: RequestMode,
    cache?: RequestCache,
    credentials?: RequestCredentials,
    referrerPolicy?: ReferrerPolicy,
    integrity?: string,
    keepalive?: boolean,
    redirect?: RequestRedirect,
    referrer?: string,
    signal?: AbortSignal | null,
    window?: any,
}

export default class HttpClient {

    constructor(private readonly defaultOption?: HttpClientOptions) {
        this.defaultOption = {
            ...{
                mode: "cors",
                // cache: "default",
                // credentials: "same-origin",
                // referrerPolicy: "same-origin",
                // keepalive: true,
                // redirect: "follow",
                window: null,
                signal: null,
                referrer: null,
                integrity: '',
                headers: null
            },
            ...defaultOption
        };
    }

    public request<R>(method: string, url: string, options?: RequestInit): Promise<Response> {
        return fetch(url, {
            ...this.defaultOption,
            ...options
        })
    };

    public delete(url: string, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, null, 'DELETE', options);
    };

    public get(url: string, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, null, 'GET', options);
    };

    public head(url: string, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, null, 'HEAD', options);
    };

    public options(url: string, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, null, 'OPTIONS', options);
    };

    public patch(url: string, body: BodyInit | null, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, body, 'PATCH', options);
    };

    public post(url: string, body: BodyInit | null, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, body, 'POST', options);
    };

    public put(url: string, body: BodyInit | null, options?: HttpClientOptions): Promise<Response> {
        return this.send(url, body, 'PUT', options);
    };

    private send(url: string, body: BodyInit | null, method: string, options?: HttpClientOptions): Promise<Response> {
        return fetch(url, {
            body: body,
            method: 'POST',
            headers: options.headers || this.defaultOption.headers,
            mode: options.mode || this.defaultOption.mode,
            cache: options.cache || this.defaultOption.cache,
            credentials: options.credentials || this.defaultOption.credentials,
            referrerPolicy: options.referrerPolicy || this.defaultOption.referrerPolicy,
            integrity: options.integrity || this.defaultOption.integrity,
            keepalive: options.keepalive || this.defaultOption.keepalive,
            redirect: options.redirect || this.defaultOption.redirect,
            referrer: options.referrer || this.defaultOption.referrer,
            signal: options.signal || this.defaultOption.signal,
            window: options.window || this.defaultOption.window,
        })
    }

}
