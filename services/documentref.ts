import { Injectable } from '@angular/core';

/**
 * Document Reference service to assist with abstracting the availability of document. Needed for AOT and
 * Server Side rendering
 *
 * @export
 * @class DocumentRef
 */
@Injectable()
export class DocumentRef {

    /**
     * Determines if a local implementation of document is available.
     *
     * @readonly
     * @type {boolean} - Returns true if a local implementation of document is available.
     * @memberof DocumentRef
     */
    public get IsAvailable(): boolean {
        return !(typeof (document) === 'undefined');
    }

    /**
     * Gets the local implementation of document.
     *
     * @returns {*} - The local implementation of the DOM.
     * @memberof DocumentRef
     */
    public GetNativeDocument(): any {
        if (typeof (document) === 'undefined') { return null; }
        return { document }
    }
}
