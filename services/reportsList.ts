import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptionsArgs } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Report } from '../models/report';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

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
    public get ServiceUrl():string { return this._serviceUrl; }
    public set ServiceUrl(val:string) { this._serviceUrl = val; }

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
    constructor(private _http: Http, private _serviceUrl: string, private _bearerToken: string) {}

    ///
    /// Public methods
    ///

    /**
     * Gets the available reports in the workspace including access tokens. 
     * @param {*} alternateHttpProvider - Optional. You can provide an alternate http implementation as an argument. This is mostly used for 
     * authenticating http providers such as ADAL that do not derive from http and can therefore not easly be depdency 
     * injected as http implementations.  
     * @returns {Observable<Array<Report>>} - An Observalbe containing the list of {@link Report} objects. 
     * @memberof ReportsListService
     */
    public GetReports(alternateHttpProvider?: any): Observable<Array<Report>> {
        if (alternateHttpProvider.get == null) throw("Alternate HTTP provider must implement get.")
        if (this._reports != null) return this._reports;

        let headers = new Headers();
        let options:RequestOptionsArgs = { headers: headers };
        if(this._bearerToken && this._bearerToken !=='') headers.append('Authorization',`Bearer ${this._bearerToken}`);
        else{
            // this request likely uses cookies for authentication. So we'll add the withCredentials to enable
            // passthrough. This is required for the Azure AD Oauth flow from client to server for example....
            options.withCredentials = true;
        }
        let x: any = alternateHttpProvider ? alternateHttpProvider : this._http;
        this._reports = x.get(this._serviceUrl + '/api/reports?includeTokens=true', options)
            .map((response: Response) => {
                let r: Array<Report> = new Array<Report>();
                for (let x of response.json()) r.push(new Report(x.id, x.name, x.accessToken, x.embedUrl));
                return r;
            })
            .do((x:any) => console.log(x));
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
        let e: Subject<string> = new Subject<string>();
        this.GetReports().subscribe(rs => {
            let r:Report = rs.find(x => { return x.Id === id; })
            if (r) {
                e.next(r.Token);
            }
        });
        return e.asObservable();
    }
}
