import { Component, Input } from '@angular/core';
import { ReportViewer } from './reportViewer';

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
                    <input id="setting-shownav" type="checkbox" [checked]="_showNavigation" (change)="OnNavPaneChange($event.target.checked)"/> Show Navigation
                </label>
            </div>
            <div class="checkbox">
                <label>
                    <input id="setting-showfilterpane" type="checkbox" [checked]="_showFilterPane" (change)="OnFilterPaneChange($event.target.checked)"/> Show Filter Pane
                </label>
            </div>
        </div>`,
    styles: [""]
})
export class ReportNavigation {
    @Input()
        get ReportViewer(): ReportViewer { return this._viewer; }
        set ReportViewer(viewer: ReportViewer) { this._viewer = viewer; }

    private _viewer: ReportViewer = null;
    private _showNavigation: boolean = true;
    private _showFilterPane: boolean = false;

    public OnPreviousPageClick() { this.ChangePage(-1); }
    public OnNextPageClick() { this.ChangePage(1); }
    public OnFilterPaneChange(checked: boolean) {
        this._showFilterPane = checked;
        this._viewer.UpdateSetting('filterPaneEnabled', checked);
    }
    public OnNavPaneChange(checked: boolean) {
        this._showNavigation = checked;
        this._viewer.UpdateSetting('navContentPaneEnabled', checked);
    }

    private ChangePage(increment: number) {
        let i: number = this._viewer.PageIndex + increment;
        if (i < 0) i = this._viewer.Pages.length - 1;
        if (i >= this._viewer.Pages.length) i = 0;

        this._viewer.Pages[i].setActive();
    }


}