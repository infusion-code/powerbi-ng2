import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PowerBIService } from '../services/service';
import { ReportsListService } from '../services/reportsList'
import { Report, Page, IEmbedConfiguration, models} from 'powerbi-client';

/**
 * Report Viewer component to display a powerbi report using the powerbi javascript api. 
 * 
 * @export
 * @class ReportViewer
 * @implements {AfterViewInit}
 */
@Component({
    selector: 'reportViewer',
    template: `
        <div #reportContainer></div>`,
    styles: [`
        :host > div { height: 85vh; }
    `]
})
export class ReportViewer implements AfterViewInit {
    ///
    /// Field declarations.
    ///
    private _embedUrl: string = 'https://embedded.powerbi.com/appTokenReportEmbed?reportId={0}';
    private _token: string;
    private _reportId: string;
    private _report: Report = null;
    private _service: PowerBIService = null;
    private _subscription: Subscription = null;
    private _reportsListService: ReportsListService = null;
    private _pages: Array<Page> = null;
    private _currentPage: Page = null;
    private _pageIndex: number = 0;
    private _initialized: boolean = false;
    @ViewChild('reportContainer') private container: ElementRef; 

    ///
    /// Property declarations. 
    ///

    /**
     * Gets or sets the Id of the report
     * 
     * @memberof ReportViewer
     */
    @Input()
        public set Id(id: string) {
            if (id == null || id == "") return;
            if (id === this._reportId) return;
            this._reportId = id;
            this.Load();
        }
        public get Id(): string { return this._reportId };

    /**
     * Gets or sets the access token to use to render the report
     * 
     * @memberof ReportViewer
     */
    @Input()
        public set Token(token: string) {
            if (token === this._token) return;
            this._token = token;
            this.Load();
        }
        public get Token(): string { return this._token };

    /**
     * Gets the current report page. 
     * 
     * @readonly
     * @type {Page}@memberof ReportViewer
     */
    public get CurrentPage(): Page { return this._currentPage; } 

    /**
     * Gets the pages in the report.
     * 
     * @readonly
     * @type {Array<Page>}@memberof ReportViewer
     */
    public get Pages(): Array<Page> { return this._pages; }

    /**
     * Gets the index of the current page. 
     * 
     * @readonly
     * @type {number}@memberof ReportViewer
     */
    public get PageIndex(): number { return this._pageIndex; }


    /**
     * Emits a Report object when the report is successfully embeded. 
     * 
     * @memberof ReportViewer
     */
    @Output() OnEmbedded = new EventEmitter<Report>();

    /**
     * Emits a Page object when the report page changes. 
     * 
     * @memberof ReportViewer
     */
    @Output() OnPageChanged = new EventEmitter<Page>();

    ///
    /// Constructor
    ///

    /**
     * Creates an instance of ReportViewer.
     * @param {PowerBIService} embedService - An instance of the powerbi embed service wrapping the powerbi API.  
     * @param {ReportsListService} reportsListService - An instance of the reports list service providing access tokens for the reports.
     * @memberof ReportViewer
     */
    constructor(embedService: PowerBIService, reportsListService: ReportsListService) {
        this._service = embedService;
        this._reportsListService = reportsListService;
    }

    ///
    /// Public methods
    ///

    /**
     * Applies a filter to the report. See 
     * https://microsoft.github.io/PowerBI-JavaScript/interfaces/_src_ifilterable_.ifilterable.html#setfilters for 
     * more information
     * 
     * @param {models.IFilter} filter - A filter object specifying the filter to apply. 
     * @param {string} target - that target (either page or report).
     * @memberof ReportViewer
     */
    public ApplyFilter(filter: models.IFilter, target: string): void {
        let filterTarget: Page | Report = target.toLowerCase() === 'page' ? this._currentPage : this._report;
        filterTarget.getFilters().then(function (allTargetFilters: Array<models.IFilter>) {
            allTargetFilters.push(filter);
            filterTarget.setFilters(allTargetFilters);
        });
    }

    /**
     * Clears the filters from a report. See
     * https://microsoft.github.io/PowerBI-JavaScript/classes/_src_report_.report.html#removefilters and 
     * https://microsoft.github.io/PowerBI-JavaScript/classes/_src_page_.page.html#removefilters for 
     * more detail
     * 
     * @memberof ReportViewer
     */
    public ClearFilters(): void {
        this._report.removeFilters();
        this._pages.forEach(function (page: Page) {
            page.removeFilters();
        });
    }

    /**
     * Initializes the component. Part of the ng component lifecycle. 
     * 
     * @memberof ReportViewer
     */
    public ngAfterViewInit(): void {
        if (this._token == null) {
            this._subscription = this._reportsListService.GetEmbedTokenForReport(this._reportId).subscribe(t => {
                if (this._report == null && this.ValidateRequiredAttributes) this.Embed(t);
            })
        }
        else {
            if (this.ValidateRequiredAttributes) this.Embed();
        }
    }

    /**
     * Frees up resources when component is destroyed. Part of the ng component lifecycle. 
     * 
     * @memberof ReportViewer
     */
    public ngOnDestroy(): void {
        if (this._subscription) this._subscription.unsubscribe();
        this.Reset(this.container.nativeElement);
    }

    /**
     * Resets the component and removes the current report. 
     * 
     * @param {HTMLElement} element 
     * @memberof ReportViewer
     */
    public Reset(element: HTMLElement): void {
        this._service.reset(element);
        this._report = null;
    }

    /**
     * Updates the report settings. For a full list of configurable settings see the following wiki page
     * https://github.com/Microsoft/PowerBI-JavaScript/wiki/Settings
     * 
     * @param {string} settingName - The name of the setting to update. 
     * @param {*} value - The value for the setting. 
     * @memberof ReportViewer
     */
    public UpdateSetting(settingName: string, value: any): void {
        let settings: models.ISettings = {};
        (<any>settings)[settingName] = value;
        this._report.updateSettings(settings);
    }
   
    ///
    /// Private methods
    ///

    /**
     * Embeds a report into the target element. 
     * 
     * @private
     * @param {string} [token] - Access token to use to render the report. 
     * @returns {void}
     * @memberof ReportViewer
     */
    private Embed(token?: string): void {
        let t: string = token ? token : this._token;
        if (typeof(window) == "undefined") return;

        // Embed configuration used to describe the what and how to embed.
        // This object is used when calling powerbi.embed.
        // This also includes settings and options such as filters.
        // You can find more information at https://github.com/Microsoft/PowerBI-JavaScript/wiki/Embed-Configuration-Details.
        let config: IEmbedConfiguration = {
            type: 'report',
            accessToken: t,
            embedUrl: this._embedUrl.replace("{0}", this._reportId),
            id: this._reportId,
            settings: {
                filterPaneEnabled: false,
                navContentPaneEnabled: true
            }
        };

        // Grab the reference to the div HTML element that will host the report.
        if (this.container == null) return;
        let reportContainer = this.container.nativeElement;

        // Embed the report and display it within the div container.
        this._report = <Report>this._service.embed(reportContainer, config);
        this.OnEmbedded.emit(this._report);

        // Report.off removes a given event handler if it exists.
        this._report.off("loaded");

        // Report.on will add an event handler which prints to Log window and performs some additional initialization.
        let that: ReportViewer = this;
        this._report.on("loaded", function () {
            console.log("PowerBIDemo: Loaded report with id '%s'.", that._reportId);
            that._report.getPages().then(function (reportPages) {
                that._pages = reportPages;
                if (that._pages.length > 0) that._pages[0].setActive();
            });
        });

        this._report.on("pageChanged", function (e) {
            that._currentPage = <Page>((<any>e.detail)["newPage"]);
            if (that._pages == null || that._pages.length === 0) {
                return;
            }

            that._pageIndex = that._pages.findIndex(function (el) {
                return el.name === that._currentPage.name;
            });
            that.OnPageChanged.emit(that._currentPage);
        });
    }

    /**
     * Loads the report for the viewer. 
     * 
     * @private
     * @returns 
     * @memberof ReportViewer
     */
    private Load() {
        let payload = (t?: string) => {
            let config: models.IReportLoadConfiguration = {
                accessToken: t ? t : this.Token,
                id: this.Id,
            };
            this._report.load(config);
        }

        if (this._report == null) return;
        if (this._token != null) payload()
        else {
            this._reportsListService.GetEmbedTokenForReport(this.Id).subscribe(t => {
                payload(t);
            })
        }
    }

    /**
     * Validates the required parameters. 
     * 
     * @private
     * @returns {boolean} - true if validation succeeds, false otherwise. 
     * @memberof ReportViewer
     */
    private ValidateRequiredAttributes(): boolean { 
        return (typeof this._embedUrl === 'string' 
            && this._embedUrl.length > 0) 
            && (typeof this._token === 'string' && this._token.length > 0); 
    }
}
