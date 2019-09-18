"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var dom_helper_1 = require("./dom.helper");
var fluent_api_call_1 = require("./fluent.api.call");
var AsyncSubject_1 = require("rxjs/AsyncSubject");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var Observable_1 = require("rxjs/Observable");
var operators_1 = require("rxjs/operators");
var LinkedInService = /** @class */ (function () {
    function LinkedInService(_domHelper, _window, _apiKey, authorize, isServer) {
        var _this = this;
        this._domHelper = _domHelper;
        this._window = _window;
        this._apiKey = _apiKey;
        this._sdkIN = undefined;
        this._authorize = authorize || false;
        this._initializationStateSource = new AsyncSubject_1.AsyncSubject();
        this.isInitialized$ = this._initializationStateSource.asObservable();
        this.isUserAuthenticated$ = new BehaviorSubject_1.BehaviorSubject(undefined);
        // Load Linkedin SDK once the service is provided
        this._domHelper.insertLinkedInScriptElement(function () { return _this._onLibraryLoadedAndInitialized(); }, this._apiKey, this._authorize, isServer);
    }
    /**
     * Gets the IN variable from the LinkedIN SDK.
     */
    LinkedInService.prototype.getSdkIN = function () {
        return this._sdkIN;
    };
    /**
     * Log a member in. If the user is not logged in,
     * it will present the popup authorization window.
     */
    LinkedInService.prototype.login = function () {
        var _this = this;
        return this.isInitialized$.pipe(operators_1.switchMap(function () {
            return Observable_1.Observable.create(function (observer) {
                _this._window.IN.User.authorize(function () {
                    observer.next(true);
                    observer.complete();
                });
            });
        }));
    };
    /**
     * Log a member out. Logging the member out is defined as logging them out of
     * the LinkedIn network (i.e. clearing cookies). This does not revoke or
     * delete the user's authorization grant for your application.
     */
    LinkedInService.prototype.logout = function () {
        var _this = this;
        return this.isInitialized$.pipe(operators_1.switchMap(function () {
            return Observable_1.Observable.create(function (observer) {
                _this._window.IN.User.logout(function () {
                    observer.next(undefined);
                    observer.complete();
                });
            });
        }));
    };
    /**
     * Refreshes a member token for an additional 30 minutes.
     * Repeated continual use of the refresh() function to keep a member indefinitely
     * logged in can result in your application being disabled.  Use this call sparingly.
     */
    LinkedInService.prototype.refresh = function () {
        var _this = this;
        return this.isInitialized$.pipe(operators_1.switchMap(function () {
            return Observable_1.Observable.create(function (observer) {
                _this._window.IN.User.refresh();
                observer.next(undefined);
                observer.complete();
            });
        }));
    };
    /**
     * Enables authenticated calls to the LinkedIn REST API using the generic call wrapper.
     * @param url The API URL to invoke: should not include https://api.linkedin.com/v1.
     */
    LinkedInService.prototype.raw = function (url) {
        return new fluent_api_call_1.FluentApiCall(this.isInitialized$, this._window, url);
    };
    LinkedInService.prototype._getIsAuthorized = function () {
        return this._window.IN.User.isAuthorized();
    };
    LinkedInService.prototype._onLibraryLoadedAndInitialized = function () {
        this._initializationStateSource.next(true);
        this._initializationStateSource.complete();
        this.isUserAuthenticated$.next(this._getIsAuthorized());
        this._setEventsOn();
        this._sdkIN = this._window.IN;
    };
    LinkedInService.prototype._setEventsOn = function () {
        var _this = this;
        this._window.IN.Event.on(this._window.IN, "auth", function () {
            _this.isUserAuthenticated$.next(true);
        });
        this._window.IN.Event.on(this._window.IN, "logout", function () {
            _this.isUserAuthenticated$.next(false);
        });
    };
    LinkedInService.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    LinkedInService.ctorParameters = function () { return [
        { type: dom_helper_1.DomHelper },
        { type: undefined, decorators: [{ type: core_1.Inject, args: ["window",] }] },
        { type: String, decorators: [{ type: core_1.Inject, args: ["apiKey",] }] },
        { type: Boolean, decorators: [{ type: core_1.Inject, args: ["authorize",] }, { type: core_1.Optional }] },
        { type: Boolean, decorators: [{ type: core_1.Inject, args: ["isServer",] }, { type: core_1.Optional }] }
    ]; };
    return LinkedInService;
}());
exports.LinkedInService = LinkedInService;
