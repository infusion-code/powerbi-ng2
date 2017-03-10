import { Component, Input } from '@angular/core';
import { ReportViewer } from './reportViewer';
import * as PowerBI from 'powerbi-client';

@Component({
    selector: 'reportFilter',
    template: `
        <h3>Filters</h3>
        <button id="filter-clear" type="button" class="btn btn-danger" (click)=ClearFilters()>Clear All Filters</button>
        <h4>Add Filter</h4>
        <form id="filter-form">
            <div class="form-group">
                <label for="filter-target">Target</label>
                <select id="filter-target" class="form-control" [(ngModel)]="_filterTarget" name="s1">
                    <option value="report">Report</option>
                    <option value="page">Page</option>
                </select>
            </div>
            <div class="form-group">
                <label for="filter-table">Table</label>
                <input type="text" class="form-control" id="filter-table" [(ngModel)]="filterTable" name="t1"/>
            </div>
            <div class="form-group">
                <label for="filter-column">Column / Measure</label>
                <input type="text" class="form-control" id="filter-column" [(ngModel)]="filterColumn" name="t2" />
            </div>
            <div class="form-group">
                <label for="filter-value">Value</label>
                <input type="text" class="form-control" id="filter-value" [(ngModel)]="_filterValue" name="t3"/>
            </div>
            <button id="filter-add" type="button" class="btn btn-success" (click)=AddFilter()>Add Filter</button>
        </form>`,
    styles: [""]
})
export class ReportFilter {
    @Input()
        get ReportViewer(): ReportViewer { return this._viewer; }
        set ReportViewer(viewer: ReportViewer) { this._viewer = viewer; }

    private _viewer: ReportViewer = null;
    public filterTable: string = "";
    public filterColumn: string = "";
    private _filterValue: string = "";
    private _filterTarget: string = "report";

    constructor() {

    }

    private Reset() {
        this.filterTable = "";
        this.filterColumn = "";
        this._filterTarget = "report";
        this._filterValue = "";
    }


    // For a complete guide to setting filters see the following wiki page
    // https://github.com/Microsoft/PowerBI-JavaScript/wiki/Filters
    public AddFilter() {
        let target = {
            column: this.filterColumn,
            table: this.filterTable
        }
        let op: PowerBI.models.BasicFilterOperators = "In";
        let values: string | number | boolean | Array<string> | Array<number> | Array<boolean> = [this._filterValue];
        let basicFilter = {
            $schema: "http://powerbi.com/product/schema#basic",
            target: target,
            operator: op,
            values: values
        };
        this._viewer.ApplyFilter(<PowerBI.models.IFilter>basicFilter, this._filterTarget);
        this.Reset();    
    }

    public ClearFilters() { this._viewer.ClearFilters(); }

}