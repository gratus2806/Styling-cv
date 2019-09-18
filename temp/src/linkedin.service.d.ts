import { DomHelper } from "./dom.helper";
import { FluentApiCall } from "./fluent.api.call";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
export declare class LinkedInService {
    private _domHelper;
    private _window;
    private _apiKey;
    /**
     * An observable that emits true and completes when library has finished loading.
     */
    isInitialized$: Observable<boolean>;
    /**
     * An observable that has an initial value of undefined.
     * It emits a boolean value when the library has finished loading and when a login or logout is performed.
     */
    isUserAuthenticated$: BehaviorSubject<boolean>;
    private _authorize;
    private _initializationStateSource;
    private _sdkIN;
    constructor(_domHelper: DomHelper, _window: any, _apiKey: string, authorize?: boolean, isServer?: boolean);
    /**
     * Gets the IN variable from the LinkedIN SDK.
     */
    getSdkIN(): any;
    /**
     * Log a member in. If the user is not logged in,
     * it will present the popup authorization window.
     */
    login(): Observable<{}>;
    /**
     * Log a member out. Logging the member out is defined as logging them out of
     * the LinkedIn network (i.e. clearing cookies). This does not revoke or
     * delete the user's authorization grant for your application.
     */
    logout(): Observable<{}>;
    /**
     * Refreshes a member token for an additional 30 minutes.
     * Repeated continual use of the refresh() function to keep a member indefinitely
     * logged in can result in your application being disabled.  Use this call sparingly.
     */
    refresh(): Observable<{}>;
    /**
     * Enables authenticated calls to the LinkedIn REST API using the generic call wrapper.
     * @param url The API URL to invoke: should not include https://api.linkedin.com/v1.
     */
    raw(url: string): FluentApiCall;
    private _getIsAuthorized();
    private _onLibraryLoadedAndInitialized();
    private _setEventsOn();
}
