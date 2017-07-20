import { Component, Input } from '@angular/core';
import { ReportViewer } from './reportViewer';

/**
 * Provides a component that can navigate through the pages in a power bi report for a given report viewer component.
 *
 * @export
 * @class ReportNavigation
 */
@Component({
    selector: 'reportNavigation',
    template: `
        <h3>Page Navigation</h3>
        <div>
            <button id="pbi-prev-page" class="btn btn-default" (click)=OnPreviousPageClick()>Previous Page</button>
            <button id="pbi-next-page" class="btn btn-default" (click)=OnNextPageClick()>Next Page</button>
        </div>
        <h3>Settings</h3>
        <div>
            <div class="checkbox">
                <label>
                    <input id="setting-shownav" type="checkbox"
                        [checked]="ShowNavigation"
                        (change)="OnNavPaneChange($event.target.checked)"/> Show Navigation
                </label>
            </div>
            <div class="checkbox">
                <label>
                    <input id="setting-showfilterpane" type="checkbox"
                        [checked]="ShowFilterPane"
                        (change)="OnFilterPaneChange($event.target.checked)"/> Show Filter Pane
                </label>
            </div>
        </div>`,
    styles: []
})
export class ReportNavigation {
    ///
    /// Field declarations
    ///
    private _viewer: ReportViewer = null;
    private _showNavigation: boolean = true;
    private _showFilterPane: boolean = false;

    ///
    /// Property declarations
    ///

    /**
     * Gets or sets the report viewer component to interact with.
     *
     * @type {ReportViewer}
     * @memberof ReportFilter
     * @property
     * @public
     */
    @Input()
        public get ReportViewer(): ReportViewer { return this._viewer; }
        public set ReportViewer(viewer: ReportViewer) { this._viewer = viewer; }

    /**
     * Gets or sets whether to show the filter pane in the report.
     *
     * @type {ReportViewer}
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get ShowFilterPane(): boolean { return this._showFilterPane; }
    public set ShowFilterPane(val: boolean) { this._showFilterPane = val; }

    /**
     * Gets or sets whether to show the navigation tabs in the report.
     *
     * @type {ReportViewer}
     * @memberof ReportFilter
     * @property
     * @public
     */
    public get ShowNavigation(): boolean { return this._showNavigation; }
    public set ShowNavigation(val: boolean) { this._showNavigation = val; }

    ///
    /// Public methods
    ///

    /**
     * Event handler handling the 'next page' button. Call to navigate one page forward.
     *
     * @memberof ReportNavigation
     */
    public OnNextPageClick() { this.ChangePage(1); }

    /**
     * Event handler handling the 'previous page' button. Call to navigate one page back.
     *
     * @memberof ReportNavigation
     */
    public OnPreviousPageClick() { this.ChangePage(-1); }

    /**
     * Toggles the filter pane in the associated report viewer.
     *
     * @param {boolean} checked
     * @memberof ReportNavigation
     */
    public OnFilterPaneChange(checked: boolean) {
        this._showFilterPane = checked;
        this._viewer.UpdateSetting('filterPaneEnabled', checked);
    }

    /**
     * Toggles the nav pane in the associated report viewer.
     *
     * @param {boolean} checked
     * @memberof ReportNavigation
     */
    public OnNavPaneChange(checked: boolean) {
        this._showNavigation = checked;
        this._viewer.UpdateSetting('navContentPaneEnabled', checked);
    }

    ///
    /// Private methods
    ///

    /**
     * Pages to the next page in the report shown in the associated viewer component.
     *
     * @private
     * @param {number} increment
     * @memberof ReportNavigation
     */
    private ChangePage(increment: number) {
        let i: number = this._viewer.PageIndex + increment;
        if (i < 0) { i = this._viewer.Pages.length - 1; }
        if (i >= this._viewer.Pages.length) { i = 0; }

        this._viewer.Pages[i].setActive();
    }
}
