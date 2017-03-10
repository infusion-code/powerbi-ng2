import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Report } from '../models/report';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

@Injectable()
export class ReportsListService {

    private _http: Http;
    private _serviceUrl = "http://slbpowerbipoc.azurewebsites.net";
    private _reports: Observable<Array<Report>>;

    constructor(http: Http) {
        this._http = http;
    }

    public GetReports(): Observable<Array<Report>> {
        if (this._reports != null) return this._reports;
        this._reports =  this._http.get(this._serviceUrl + '/api/reports?includeTokens=true')
            .map((response: Response) => {
                let r: Array<Report> = new Array<Report>();
                for (let x of response.json()) r.push(new Report(x.id, x.name, x.accessToken, x.embedUrl));
                return r;
            })
            .do(x => console.log(x));
                // for debugging purposes.

        return this._reports;
    }

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