"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var ZoneHelper = /** @class */ (function () {
    function ZoneHelper(_zone) {
        this._zone = _zone;
    }
    ZoneHelper.prototype.runZoneIfNotAlready = function (callback) {
        if (core_1.NgZone.isInAngularZone()) {
            callback();
        }
        else {
            this._zone.run(function () {
                callback();
            });
        }
    };
    ZoneHelper.decorators = [
        { type: core_1.Injectable },
    ];
    /** @nocollapse */
    ZoneHelper.ctorParameters = function () { return [
        { type: core_1.NgZone }
    ]; };
    return ZoneHelper;
}());
exports.ZoneHelper = ZoneHelper;
