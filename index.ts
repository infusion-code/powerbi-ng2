import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Import models
 */
import { Report } from './models/report';

/**
 * Import components
 */
import { ReportFilter } from './components/reportFilter';
import { ReportNavigation } from './components/reportNavigation';
import { ReportViewer } from './components/reportViewer';
import { ReportsList } from './components/reportsList'
import { ReportDashboard } from './components/reportDashboard';

/**
 * Import services
 */
import { PowerBIService } from './services/service';
import { ReportsListService } from './services/reportsList';
import { DocumentRef} from './services/documentRef';
import { WindowRef } from './services/windowRef'; 

/**
 * Create barrel
 */
export { 
    Report,
    WindowRef,
    DocumentRef,
    PowerBIService,
    ReportsListService,
    ReportNavigation,
    ReportViewer,
    ReportFilter,
    ReportsList,
    ReportDashboard
}

/**
 * Module definition.
 * 
 * @export
 * @class PowerBIModule
 */
@NgModule({
    imports: [
        CommonModule, 
        HttpModule, 
        RouterModule, 
        FormsModule 
    ],
    declarations: [
        ReportNavigation, 
        ReportViewer, 
        ReportFilter, 
        ReportsList, 
        ReportDashboard 
    ],
    exports: [
        ReportNavigation, 
        ReportViewer, 
        ReportFilter, 
        ReportsList, 
        ReportDashboard 
    ]
})
export class PowerBIModule {

    /**
     * Call forRoot() when importing the module in the application root module to create app wide services.
     * Only call forRoot() once in your application. 
     * 
     * @static
     * @param {string} webAPIServiceUrl - the url of the WebAPI service listing the reports and access tokens in the PowerBI workspace.
     * @param {string} bearerToken - OAuth token to use to access the web api (if secured).
     * @returns {ModuleWithProviders} - A module with injectable providers.
     * @memberof PowerBIModule
     */
    static forRoot(webAPIServiceUrl: string, bearerToken?: string): ModuleWithProviders{
        WebAPIServiceUrl = webAPIServiceUrl;
        BearerToken = bearerToken;
        return {
            ngModule: PowerBIModule,
            providers: [
                { provide: ReportsListService, deps: [Http], useFactory: ReportListServiceFactory },
                PowerBIService,
                WindowRef,
                DocumentRef
            ]
        };

    }
}

let WebAPIServiceUrl: string = '';
let BearerToken: string = '';

/**
 * Factory function to the ReportsListService.
 *
 * @export
 * @param {Http} http - An instance of the http service.
 * @returns {ReportsListService} - An instance of the {@link ReportsListService}.
 */
export function ReportListServiceFactory(http: Http): ReportsListService {
    return new ReportsListService(http, WebAPIServiceUrl, BearerToken);
}