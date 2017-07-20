import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

/**
 * Import models
 */
import { Report } from './src/models/report';

/**
 * Import components
 */
import { ReportFilter } from './src/components/reportFilter';
import { ReportNavigation } from './src/components/reportNavigation';
import { ReportViewer } from './src/components/reportViewer';
import { ReportsList } from './src/components/reportsList'
import { ReportDashboard } from './src/components/reportDashboard';

/**
 * Import services
 */
import { PowerBIService } from './src/services/service';
import { ReportsListService, ReportsListServiceConfig } from './src/services/reportsList';
import { DocumentRef} from './src/services/documentRef';
import { WindowRef } from './src/services/windowRef';

/**
 * Create barrel
 */
export {
    Report,
    WindowRef,
    DocumentRef,
    PowerBIService,
    ReportsListService,
    ReportsListServiceConfig,
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
        CommonModule,
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
    static forRoot(config?: ReportsListServiceConfig): ModuleWithProviders {
        return {
            ngModule: PowerBIModule,
            providers: [
                config ? { provide: ReportsListServiceConfig, useValue: config } : ReportsListServiceConfig,
                { provide: ReportsListService, deps: [Http, ReportsListServiceConfig], useFactory: ReportsListServiceFactory },
                PowerBIService,
                WindowRef,
                DocumentRef
            ]
        };

    }
}

/**
 * Factory function to the ReportsListService.
 *
 * @export
 * @param {Http} http - An instance of the http service.
 * @returns {ReportsListService} - An instance of the {@link ReportsListService}.
 */
export function ReportsListServiceFactory(http: Http, config: ReportsListServiceConfig): ReportsListService {
    return new ReportsListService(http, config);
}
