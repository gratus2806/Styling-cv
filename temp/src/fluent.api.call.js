"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("rxjs/Observable");
var operators_1 = require("rxjs/operators");
var FluentApiCall = /** @class */ (function () {
    function FluentApiCall(isLoadedObservable, _window, url) {
        this.isLoadedObservable = isLoadedObservable;
        this._window = _window;
        this._fluentCallbackStack = new Array();
        this._fluentCallbackStack.push(function (raw) { return raw.IN.API.Raw(url); });
    }
    FluentApiCall.prototype.url = function (url) {
        this._fluentCallbackStack.push(function (raw) { return raw.url(url); });
        return this;
    };
    FluentApiCall.prototype.method = function (method) {
        this._fluentCallbackStack.push(function (raw) { return raw.method(method); });
        return this;
    };
    FluentApiCall.prototype.body = function (body) {
        this._fluentCallbackStack.push(function (raw) { return raw.body(body); });
        return this;
    };
    FluentApiCall.prototype.asObservable = function () {
        var _this = this;
        return this.isLoadedObservable.pipe(operators_1.switchMap(function () {
            return Observable_1.Observable.create(function (observer) {
                _this.executeFluentCallbackStack()
                    .result(function (data) {
                    observer.next(data);
                    observer.complete();
                })
                    .error(function (error) {
                    observer.error(error);
                });
            });
        }));
    };
    FluentApiCall.prototype.executeFluentCallbackStack = function () {
        var currentInstance = this._window;
        this._fluentCallbackStack.forEach(function (callback) {
            currentInstance = callback(currentInstance);
        });
        return currentInstance;
    };
    return FluentApiCall;
}());
exports.FluentApiCall = FluentApiCall;
