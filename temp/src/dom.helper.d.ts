import { ZoneHelper } from './zone.helper';
export declare class DomHelper {
    private _zoneHelper;
    private _document;
    private _window;
    constructor(_zoneHelper: ZoneHelper, _document: any, _window: any);
    insertLinkedInScriptElement(initializationCallback: () => void, apiKey: string, authorize?: boolean, isServer?: boolean): void;
    private _initializeLibrary(initializationCallback);
    private _writeToDOM(apiKey, authorize);
}
