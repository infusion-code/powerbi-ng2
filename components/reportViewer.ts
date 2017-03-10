import { Component, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { PowerBIService } from '../services/service';
import { ReportsListService } from '../services/reportsList'
import { Report, Page, IEmbedConfiguration, models} from 'powerbi-client';

@Component({
    selector: 'reportViewer',
    template: `
        <div #reportContainer></div>`,
    styles: [":host > div { height: 85vh; }"]
})
export class ReportViewer implements AfterViewInit {
    @Input()
        set Id(id: string) {
            if (id == null || id == "") return;
            if (id === this._reportId) return;
            this._reportId = id;
            this.Load();
        }
        get Id(): string { return this._reportId };
    @Input()
        set Token(token: string) {
            if (token === this._token) return;
            this._token = token;
            this.Load();
        }
        get Token(): string { return this._token };
    @Output() OnEmbedded = new EventEmitter<Report>();
    @Output() OnPageChanged = new EventEmitter<Page>();
    @ViewChild('reportContainer') container: ElementRef; 

    get Pages(): Array<Page> { return this._pages; }
    get CurrentPage(): Page { return this._currentPage; } 
    get PageIndex(): number { return this._pageIndex; }

    private _embedUrl: string = "https://embedded.powerbi.com/appTokenReportEmbed?reportId={0}";
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

    constructor(embedService: PowerBIService, reportsListService: ReportsListService) {
        this._service = embedService;
        this._reportsListService = reportsListService;
    }

    private Embed(token?: string) {
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
            that._currentPage = <Page>(e.detail["newPage"]);
            if (that._pages == null || that._pages.length === 0) {
                return;
            }

            that._pageIndex = that._pages.findIndex(function (el) {
                return el.name === that._currentPage.name;
            });
            that.OnPageChanged.emit(that._currentPage);
        });
    }

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

    private ValidateRequiredAttributes() { return (typeof this._embedUrl === 'string' && this._embedUrl.length > 0) && (typeof this._token === 'string' && this._token.length > 0); }

    public ngAfterViewInit() {
        if (this._token == null) {
            this._subscription = this._reportsListService.GetEmbedTokenForReport(this._reportId).subscribe(t => {
                if (this._report == null && this.ValidateRequiredAttributes) this.Embed(t);
            })
        }
        else {
            if (this.ValidateRequiredAttributes) this.Embed();
        }
    }

    public ngOnDestroy() {
        if (this._subscription) this._subscription.unsubscribe();
        this.Reset(this.container.nativeElement);
    }

    public ApplyFilter(filter: models.IFilter, target: string) {
        let filterTarget: Page | Report = target.toLowerCase() === 'page' ? this._currentPage : this._report;
        filterTarget.getFilters().then(function (allTargetFilters: Array<models.IFilter>) {
            allTargetFilters.push(filter);

            // Set filters
            // https://microsoft.github.io/PowerBI-JavaScript/interfaces/_src_ifilterable_.ifilterable.html#setfilters
            filterTarget.setFilters(allTargetFilters);
        });
    }

    public ClearFilters() {
        // Remove report filters
        // https://microsoft.github.io/PowerBI-JavaScript/classes/_src_report_.report.html#removefilters
        this._report.removeFilters();
        this._pages.forEach(function (page: Page) {
            // Remove page filters
            // https://microsoft.github.io/PowerBI-JavaScript/classes/_src_page_.page.html#removefilters
            page.removeFilters();
        });
    }

    public Reset(element: HTMLElement) {
        this._service.reset(element);
        this._report = null;
    }

    // For a full list of configurable settings see the following wiki page
    // https://github.com/Microsoft/PowerBI-JavaScript/wiki/Settings
    public UpdateSetting(settingName: string, value: any) {
        let settings: IEmbedConfiguration = {};
        settings[settingName] = value;
        this._report.updateSettings(settings);
    }

}