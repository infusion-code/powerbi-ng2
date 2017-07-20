import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Report } from '../models/report';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';


@Injectable()
export class ReportsListServiceConfig  {
    WebAPIServiceUrl: string = '';
    BearerToken?: string = '';
}

/**
 *  Injectable sevice providing a list of available reports in the workspace.
 *
 * @export
 * @class ReportsListService
 */
@Injectable()
export class ReportsListService {
    ///
    /// Field declarations
    ///
    private _reports: Observable<Array<Report>>;

    ///
    /// Property declarations
    ///

    /**
     * Gets or set the service url base for the reports list service.
     *
     * @type {string}@memberof ReportsListService
     */
    public get ServiceUrl(): string {
        let u: string = '';
        if (this._config) { u = this._config.WebAPIServiceUrl; }
        return u;
    }
    public set ServiceUrl(val: string) {
        if (this._config == null) { this._config = new ReportsListServiceConfig(); }
        this._config.WebAPIServiceUrl = val;
    }

    ///
    /// Constructor
    ///

    /**
     * Creates an instance of ReportsListService.
     * @param {Http} _http - Instance of the http service.
     * @param {string} _serviceUrl - String containing the service Url of the web api providing a list of available
     * reports with access tokens.
     * @param {string} _bearerToken - OAuth token to use to access the web api (if secured).
     * @memberof ReportsListService
     */
    constructor(private _http: Http, private _config: ReportsListServiceConfig) {}

    ///
    /// Public methods
    ///

    /**
     * Gets the available reports in the workspace including access tokens.
     * @param {*} alternateHttpProvider - Optional. You can provide an alternate http implementation as an argument.
     * This is mostly used for authenticating http providers such as ADAL that do not derive from http and can
     * therefore not easly be depdency injected as http implementations.
     * @param {boolean} allowCredentials - Set to true to allowCredentials when no bearer token exists.
     * Use false to prevent withCredentials.
     * @returns {Observable<Array<Report>>} - An Observalbe containing the list of {@link Report} objects.
     * @memberof ReportsListService
     */
    public GetReports(alternateHttpProvider?: any, allowCredentials?: boolean): Observable<Array<Report>> {
        if (alternateHttpProvider && alternateHttpProvider.get == null) { throw(new Error('Alternate HTTP provider must implement get.')); }
        if (this._reports != null) { return this._reports; }

        const headers = new Headers();
        const options: RequestOptionsArgs = { headers: headers };
        if (this._config && this._config.BearerToken !== '') { headers.append('Authorization', `Bearer ${this._config.BearerToken}`); }
        else {
            // this request likely uses cookies for authentication. So we'll add the withCredentials to enable
            // passthrough. This is required for the Azure AD Oauth flow from client to server for example....
            if (allowCredentials) { options.withCredentials = true; }
        }
        const x: any = alternateHttpProvider ? alternateHttpProvider : this._http;
        this._reports = x.get(this.ServiceUrl + '/api/reports?includeTokens=true', options)
            .map((response: Response) => {
                const r: Array<Report> = new Array<Report>();
                for (const z of response.json()) { r.push(new Report(z.id, z.name, z.accessToken, z.embedUrl)); }
                return r;
            })
            .do((z: any) => console.log(z));
                // for debugging purposes.

        return this._reports;
    }

    /**
     * Obtains a new access token for a given report.
     *
     * @param {string} id - The report for which to obtain the acecss token.
     * @returns {Observable<string>} - Observable containing the access token.
     * @memberof ReportsListService
     */
    public GetEmbedTokenForReport(id: string): Observable<string> {
        const e: Subject<string> = new Subject<string>();
        this.GetReports().subscribe(rs => {
            const r: Report = rs.find(x => { return x.Id === id; })
            if (r) {
                e.next(r.Token);
            }
        });
        return e.asObservable();
    }
}
