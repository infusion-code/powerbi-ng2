import { Component, Input } from '@angular/core';
import { ReportViewer } from './reportViewer';
import { models } from 'powerbi-client';

/**
 * Implements a component to filter a report for a given report viewer.
 *
 * @class ReportFilter
 * @export
 * @component
 */
@Component({
    selector: 'reportFilter',
    template: `
        <h3>Filters</h3>
        <button id="filter-clear" type="button" class="btn btn-danger" (click)=ClearFilters()>Clear All Filters</button>
        <h4>Add Filter</h4>
        <form id="filter-form">
            <div class="form-group">
                <label for="filter-target">Target</label>
                <select id="filter-target" class="form-control" [(ngModel)]="FilterTarget" name="s1">
                    <option value="report">Report</option>
                    <option value="page">Page</option>
                </select>
            </div>
            <div class="form-group">
                <label for="filter-table">Table</label>
                <input type="text" class="form-control" id="filter-table" [(ngModel)]="FilterTable" name="t1"/>
            </div>
            <div class="form-group">
                <label for="filter-column">Column / Measure</label>
                <input type="text" class="form-control" id="filter-column" [(ngModel)]="FilterColumn" name="t2" />
            </div>
            <div class="form-group">
                <label for="filter-value">Value</label>
                <input type="text" class="form-control" id="filter-value" [(ngModel)]="FilterValue" name="t3"/>
            </div>
            <button id="filter-add" type="button" class="btn btn-success" (click)=AddFilter()>Add Filter</button>
        </form>`,
    styles: []
})
export class ReportFilter {
    ///
    /// Field declarations
    ///
    private _viewer: ReportViewer = null;
    private _filterValue: string = '';
    private _filterTarget: string = 'report';
    private _filterTable: string = '';
    private _filterColumn: string = '';

    ///
    /// Property declarations
    ///

    /**
     * Gets or sets the column targeted by the filter to add.
     * @type string
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get FilterColumn(): string { return this._filterColumn; }
    public set FilterColumn(val: string) { this._filterColumn = val; }

    /**
     * Gets or sets the table targeted by the filter to add.
     * @type string
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get FilterTable(): string { return this._filterTable; }
    public set FilterTable(val: string) { this._filterTable = val; }

    /**
     * Gets or sets the filter target of a filter to add. Expected values are Report or Page.
     * @type string
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get FilterTarget(): string { return this._filterTarget; }
    public set FilterTarget(val: string) {
        if (val.toLowerCase() !== 'report' && val.toLowerCase() !== 'page') {
            console.log (`Unexpected value ${val} for FilterTarge. Expected 'report' or 'page'. Ignoring...`);
            return;
        }
        this._filterTarget = val.toLowerCase();
    }

    /**
     * Gets or sets the filter value of a filter to add
     * @type string
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get FilterValue(): string { return this._filterValue; }
    public set FilterValue(val: string) { this._filterValue = val; }

    /**
     * Gets or sets the report viewer component to interact with.
     *
     * @type ReportViewer
     * @memberof ReportFilter
     * @property
     * @public
     */
    @Input()
        public get ReportViewer(): ReportViewer { return this._viewer; }
        public set ReportViewer(viewer: ReportViewer) { this._viewer = viewer; }

    ///
    /// Public methods
    ///

    /**
     * Adds a report filter. For a complete guide to setting filters see the following wiki page
     * https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters
     *
     * @memberof ReportFilter
     * @method
     * @public
     */
    public AddFilter(): void {
        const target = {
            column: this._filterColumn,
            table: this._filterTable
        }
        const op: models.BasicFilterOperators = 'In';
        const values: string | number | boolean | Array<string> | Array<number> | Array<boolean> = [this._filterValue];
        const basicFilter = {
            $schema: 'http://powerbi.com/product/schema#basic',
            target: target,
            operator: op,
            values: values
        };
        this._viewer.ApplyFilter(<models.IBasicFilter>basicFilter, this._filterTarget);
        this.Reset();
    }

    /**
     * Clears all report filters.
     *
     * @memberof ReportFilter
     * @method
     * @public
     */
    public ClearFilters(): void { this._viewer.ClearFilters(); }


    ///
    /// Private methods
    ///

    /**
     * Resets the filters.
     *
     * @memberof ReportFilter
     * @method
     * @private
     */
    private Reset(): void {
        this._filterTable = '';
        this._filterColumn = '';
        this._filterTarget = 'report';
        this._filterValue = '';
    }

}
