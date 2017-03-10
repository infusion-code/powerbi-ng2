import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Report } from './models/report';
import { ReportFilter } from './components/reportFilter';
import { ReportNavigation } from './components/reportNavigation';
import { ReportViewer } from './components/reportViewer';
import { ReportsList } from './components/reportsList'
import { ReportDashboard } from './components/reportDashboard';
import { PowerBIService } from './services/service';
import { ReportsListService } from './services/reportsList';


export { Report, PowerBIService, ReportsListService, ReportNavigation, ReportViewer, ReportFilter, ReportsList, ReportDashboard }

@NgModule({
    imports: [CommonModule, HttpModule, RouterModule ],
    declarations: [ReportNavigation, ReportViewer, ReportFilter, ReportsList, ReportDashboard ],
    exports: [ReportNavigation, ReportViewer, ReportFilter, ReportsList, ReportDashboard ],
    providers: [PowerBIService, ReportsListService ]
})
export class PowerBIModule {}