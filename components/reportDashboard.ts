import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'report-dashboard',
    template: `
        <div class="side-body padding-top">
            <div class="col-md-9">
                <reportViewer #viewer [Id]="ReportId" [Token]="AccessToken"></reportViewer>
            </div>
            <div class="col-md-3">
                <reportNavigation [ReportViewer]="viewer"></reportNavigation>
                <reportFilter [ReportViewer]="viewer"></reportFilter>
            </div>
        </div>
    `,
    styles: [

    ]
})
export class ReportDashboard implements OnInit, OnDestroy {

    private _route: ActivatedRoute = null;
    private _parameterSubscription: Subscription = null;
    private _querySubscription: Subscription = null
    private _id: string;
    private _token: string;
    private _name: string;

    public get ReportId() { return this._id; }
    public get AccessToken() { return this._token; };

    constructor(route: ActivatedRoute) { this._route = route; }

    public ngOnInit() {
        this._parameterSubscription = this._route.params.subscribe(params => {
            this._id = params['id'];
            this._name = params['name']
        });
        this._querySubscription = this._route.queryParams.subscribe(params => {
            this._token = params['token'];
        });
    }

    public ngOnDestroy() {
        if (this._parameterSubscription) this._parameterSubscription.unsubscribe();
        if (this._querySubscription) this._querySubscription.unsubscribe();
    }

}
