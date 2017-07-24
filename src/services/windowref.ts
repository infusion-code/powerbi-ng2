import { Injectable } from '@angular/core';

/**
 * Window Reference service to assist with abstracting the availability of window. Needed for AOT and
 * Server Side rendering
 *
 * @class WindowRef
 * @export
 * @service
 * @injectable
 */
@Injectable()
export class WindowRef {
     /**
     * Determines if a local implementation of window is available.
     *
     * @type {boolean} - Returns true if a local implementation of window is available.
     * @memberof WindowRef
     * @readonly
     * @property
     * @public
     */
    public get IsAvailable(): boolean {
        return !(typeof (window) === 'undefined');
    }

    /**
     * Gets the local implementation of window.
     *
     * @returns {*} - The local implementation of the window.
     * @memberof WindowRef
     * @method
     * @public
     */
    public GetNativeWindow(): any {
        if (typeof (window) === 'undefined') { return null; }
        return window;
    }
}

