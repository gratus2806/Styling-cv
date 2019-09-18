import { NgZone } from '@angular/core';
export declare class ZoneHelper {
    private _zone;
    constructor(_zone: NgZone);
    runZoneIfNotAlready(callback: any): void;
}
