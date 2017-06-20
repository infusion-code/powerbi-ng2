import { Injectable } from "@angular/core";

/**
 * Window Reference service to assist with abstracting the availability of window. Needed for AOT and 
 * Server Side rendering
 * 
 * @export
 * @class WindowRef
 */
@Injectable()
export class WindowRef {
    
     /**
     * Determines if a local implementation of window is available. 
     * 
     * @readonly
     * @type {boolean} - Returns true if a local implementation of window is available. 
     * @memberof WindowRef 
     */   
    public get IsAvailable(): boolean {
        return !(typeof (window) == "undefined");
    }

    /**
     * Gets the local implementation of window. 
     * 
     * @returns {*} - The local implementation of the window. 
     * @memberof WindowRef
     */
    public GetNativeWindow(): any {
        if (typeof (window) == "undefined") return null;
        return window;
    }
}

