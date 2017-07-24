import { Component, OnInit, Injectable, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReportsListService } from '../services/reportsList';
import { Report } from '../models/report';

/**
 * Implements a list of reports to be used in navigation component to route to report Dashboards.
 *
 * @class ReportsList
 * @implements OnInit
 * @implements OnDestroy
 * @export
 * @component
 */
@Component({
    selector: 'reportsList',
    template: `
        <li class="panel panel-default dropdown" [routerLinkActive]="['active']">
            <a data-toggle="collapse" href="#reports-nav">
                <span class="icon fa fa-bar-chart"></span><span class="title">Reports</span>
            </a>
            <!-- Dropdown level 1 -->
            <div id="reports-nav" class="panel-collapse collapse">
                <div class="panel-body">
                    <ul class="nav navbar-nav">
                        <li *ngFor="let report of Reports" class="" [routerLinkActive]="['active']">
                            <a [routerLink]="['/dashboard', report.Id, report.Name ]"
                                [queryParams] = "{ token: report.Token }">{{report.Name}}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </li>
    `,
    styles: ['']
})
export class ReportsList implements OnInit, OnDestroy {
    ///
    /// Field declarations
    ///
    private _reports: Array<Report>;
    private _subscription: Subscription;

    ///
    /// Property declarations
    ///

    /**
     * Gets the collection of {@link Report} objects available.
     *
     * @type Array<Report>
     * @memberof ReportsList
     * @readonly
     * @property
     * @public
     */
    public get Reports(): Array<Report> { return this._reports; }

    ///
    /// Constructor
    ///

    /**
     * Creates an instance of ReportsList.
     * @param {ReportsListService} _reportService - An instance of the ReportsListService to provide the data.
     * @memberof ReportsList
     * @constructor
     * @public
     */
    constructor(private _reportService: ReportsListService) { }

    ///
    /// Public methods
    ///

    /**
     * Initializes the component. Part of the ng component lifecycle.
     *
     * @memberof ReportsList
     * @method
     * @public
     */
    public ngOnInit(): void {
        this._subscription = this._reportService.GetReports().subscribe(
            data => this._reports = data,
            error => console.log(error),
            () => console.log('Data retrieval complete')
        );
    }

    /**
     * Frees up resources on component destruction. Part of the ng component lifecycle.
     *
     * @memberof ReportsList
     * @method
     * @public
     */
    public ngOnDestroy(): void {
        if (this._subscription) { this._subscription.unsubscribe(); }
    }
}
