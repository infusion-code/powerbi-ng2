﻿import { Injectable } from '@angular/core';
import { WindowRef } from './windowRef';
import { service, factories, IEmbedConfiguration, Embed } from 'powerbi-client';

/**
 * Wrapper for the Microsoft Javascript PowerBI client. This wrapper is browser aware in order to correctly
 * work with AOT and server side rendering. Unfortunately, reports cannot be serverside rendered but will be rendered
 * once the state is shipped to the client.
 *
 * @class PowerBIService
 * @export
 * @service
 * @injectable
 */
@Injectable()
export class PowerBIService {
    ///
    /// Field declarations
    ///
    private _powerBiCoreService: service.Service;
    private _isBrowser: boolean = false;

    ///
    /// Constructor
    ///

    /**
     * Creates an instance of PowerBIService.
     *
     * @param {WindowRef} _windowRef - an instance of {@link WindowRef} to determine availability of client side context.
     * @memberof PowerBIService
     * @constructor
     * @public
     */
    constructor(private _windowRef: WindowRef) {
        // create a service instance
        if (this._windowRef.IsAvailable) {
            this._isBrowser = true;
            this._powerBiCoreService = new service.Service(
                factories.hpmFactory,
                factories.wpmpFactory,
                factories.routerFactory);
        }
    }

    ///
    /// Public methods
    ///

    /**
     * Embeds a report into an HTML element.
     *
     * @param {HTMLElement} element - Element into which to embed the report.
     * @param {pbi.IEmbedConfiguration} config - Configuration paramters.
     * @returns {pbi.Embed} - A {@link pbi.Embed} object representing the embeded report.
     * @memberof PowerBIService
     * @method
     * @public
     */
    public embed(element: HTMLElement, config: IEmbedConfiguration): Embed {
        if (!this._isBrowser) { return this.HandleBrowserContextError(); }
        return this._powerBiCoreService.embed(element, config);
    }

    /**
     * Gets the report embeded in an HTML element.
     *
     * @param {HTMLElement} element - Element from which to obtain the report.
     * @returns {pbi.Embed} - A {@link pbi.Embed} object representing the embeded report.
     * @memberof PowerBIService
     * @method
     * @public
     */
    public get(element: HTMLElement): Embed {
        if (!this._isBrowser) { return this.HandleBrowserContextError(); }
        return this._powerBiCoreService.get(element);
    }

    /**
     * Find a PowerBI report or tile with a given Id.
     *
     * @param {string} uniqueId - Id to search for.
     * @returns {pbi.Embed} - A PowerBI report or tile object matching the id.
     * @memberof PowerBIService
     * @method
     * @public
     */
    public find(uniqueId: string): Embed {
        if (!this._isBrowser) { return this.HandleBrowserContextError(); }
        return this._powerBiCoreService.find(uniqueId);
    }

    /**
     * Removes the embeded report from an HTML element.
     *
     * @param {HTMLElement} element - Element from which to remove the report.
     * @returns {void}
     * @memberof PowerBIService
     * @method
     * @public
     */
    public reset(element: HTMLElement): void {
        if (!this._isBrowser) { return this.HandleBrowserContextError(); }
        this._powerBiCoreService.reset(element);
    }

    ///
    /// Private methods
    ///

    /**
     * Handles invalid browser context errors
     *
     * @returns {*}
     * @memberof PowerBIService
     * @method
     * @private
     */
    private HandleBrowserContextError(): any {
        throw (new Error(`Not supported in server or AOT contexts. Use WindowRef.IsAvailable to
            determine browser context and only call this method in a valid browser context.`));
    }
}
