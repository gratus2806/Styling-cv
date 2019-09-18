"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var dom_helper_1 = require("./dom.helper");
var linkedin_service_1 = require("./linkedin.service");
var zone_helper_1 = require("./zone.helper");
var window_helper_1 = require("./window.helper");
var ɵ0 = window_helper_1.getWindow;
exports.ɵ0 = ɵ0;
var LinkedInSdkModule = /** @class */ (function () {
    function LinkedInSdkModule() {
    }
    LinkedInSdkModule.decorators = [
        { type: core_1.NgModule, args: [{
                    imports: [
                        common_1.CommonModule
                    ],
                    declarations: [],
                    providers: [
                        { provide: 'window', useFactory: ɵ0 },
                        zone_helper_1.ZoneHelper,
                        dom_helper_1.DomHelper,
                        linkedin_service_1.LinkedInService
                    ],
                    exports: []
                },] },
    ];
    return LinkedInSdkModule;
}());
exports.LinkedInSdkModule = LinkedInSdkModule;
