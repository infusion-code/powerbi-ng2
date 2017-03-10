import { Injectable } from '@angular/core';
import * as pbi from 'powerbi-client';

@Injectable()
export class PowerBIService {
    private _powerBiCoreService: pbi.service.Service;
    private _pbi: any;

    constructor() {
        // create a service instance
        this._pbi = require('powerbi-client');
        this._powerBiCoreService = <pbi.service.Service>new this._pbi.service.Service(this._pbi.factories.hpmFactory, this._pbi.factories.wpmpFactory, this._pbi.factories.routerFactory);
    }

    public embed(element: HTMLElement, config: pbi.IEmbedConfiguration): pbi.Embed {
        return this._powerBiCoreService.embed(element, config);
    }

    public get(element: HTMLElement): pbi.Embed {
        return this._powerBiCoreService.get(element);
    }

    public find(uniqueId: string): pbi.Report | pbi.Tile {
        return this._powerBiCoreService.find(uniqueId);
    }

    public reset(element: HTMLElement): void {
        this._powerBiCoreService.reset(element);
    }
}