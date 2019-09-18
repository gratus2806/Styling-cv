"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var zone_helper_1 = require("./zone.helper");
var DomHelper = /** @class */ (function () {
    function DomHelper(_zoneHelper, _document, _window) {
        this._zoneHelper = _zoneHelper;
        this._document = _document;
        this._window = _window;
    }
    DomHelper.prototype.insertLinkedInScriptElement = function (initializationCallback, apiKey, authorize, isServer) {
        if (isServer !== true) {
            this._initializeLibrary(initializationCallback);
            this._writeToDOM(apiKey, authorize);
        }
    };
    DomHelper.prototype._initializeLibrary = function (initializationCallback) {
        var _this = this;
        this._window['linkedInStateChangeRef'] = function () {
            _this._zoneHelper.runZoneIfNotAlready(function () {
                if (initializationCallback) {
                    initializationCallback();
                }
            });
        };
    };
    DomHelper.prototype._writeToDOM = function (apiKey, authorize) {
        var linkedInScriptElement = this._document.createElement('script');
        linkedInScriptElement.type = 'text/javascript';
        var linkedInAPISrc = '//platform.linkedin.com/in.js';
        linkedInScriptElement.src = linkedInAPISrc;
        var linkedInAPIKey = "\napi_key: " + apiKey;
        var linkedInAPIOnLoad = "\nonLoad: window.linkedInStateChangeRef";
        var linkedInAPIAuthorize = "\nauthorize: " + authorize + "\n";
        var linkedInAPICfg = linkedInAPIKey + linkedInAPIOnLoad + linkedInAPIAuthorize;
        linkedInScriptElement.innerHTML = linkedInAPICfg;
        this._document.head.appendChild(linkedInScriptElement);
    };
    DomHelper.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    DomHelper.ctorParameters = function () { return [
        { type: zone_helper_1.ZoneHelper },
        { type: undefined, decorators: [{ type: core_1.Inject, args: [platform_browser_1.DOCUMENT,] }] },
        { type: undefined, decorators: [{ type: core_1.Inject, args: ['window',] }] }
    ]; };
    return DomHelper;
}());
exports.DomHelper = DomHelper;
