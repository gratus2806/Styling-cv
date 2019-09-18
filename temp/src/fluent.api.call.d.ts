import { Observable } from "rxjs/Observable";
export declare class FluentApiCall {
    private isLoadedObservable;
    private _window;
    private _fluentCallbackStack;
    constructor(isLoadedObservable: Observable<boolean>, _window: any, url: string);
    url(url: string): FluentApiCall;
    method(method: string): FluentApiCall;
    body(body: string): FluentApiCall;
    asObservable(): Observable<Object>;
    private executeFluentCallbackStack();
}
