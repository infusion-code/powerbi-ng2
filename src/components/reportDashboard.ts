import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * Implements a compound component displaying a report including navigation and filter panel. This component obtains report id and
 * access token from the route.
 *
 * @class ReportDashboard
 * @implements OnInit
 * @implements OnDestroy
 * @export
 * @component
 */
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
    styles: []
})
export class ReportDashboard implements OnInit, OnDestroy {
    ///
    /// Field declarations
    ///
    private _parameterSubscription: Subscription = null;
    private _querySubscription: Subscription = null
    private _id: string;
    private _token: string;
    private _name: string;

    ///
    /// Property declarationa
    ///

    /**
     * Gets the report id.
     *
     * @type string
     * @memberof ReportDashboard
     * @property
     * @public
     * @readonly
     */
    public get ReportId(): string { return this._id; }

    /**
     * Gets the access token.
     *
     * @type string
     * @memberof ReportDashboard
     * @property
     * @public
     * @readonly
     */
    public get AccessToken(): string { return this._token; };

    /**
     * Creates an instance of ReportDashboard.
     * @param {ActivatedRoute} route - The current route. Used to obtain report id and access token.
     * @memberof ReportDashboard
     * @constructor
     * @public
     */
    constructor(private _route: ActivatedRoute) { }

    /**
     * Intiializes the component. part of the ng2 component lifecycle. Obtains report parameters from route.
     *
     * @memberof ReportDashboard
     * @method
     * @public
     */
    public ngOnInit(): void {
        this._parameterSubscription = this._route.params.subscribe(params => {
            this._id = params['id'];
            this._name = params['name']
        });
        this._querySubscription = this._route.queryParams.subscribe(params => {
            this._token = params['token'];
        });
    }

    /**
     * Frees up resources on component destruction.
     *
     * @memberof ReportDashboard
     * @method
     * @public
     */
    public ngOnDestroy(): void {
        if (this._parameterSubscription) { this._parameterSubscription.unsubscribe(); }
        if (this._querySubscription) { this._querySubscription.unsubscribe(); }
    }
}
