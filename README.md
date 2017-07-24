
[![npm version](https://badge.fury.io/js/powerbi-ng2.svg)](https://www.npmjs.com/package/powerbi-ng2) ![powerbi-ng2](https://img.shields.io/npm/dm/powerbi-ng2.svg) [![All Contributors](https://img.shields.io/badge/all_contributors-3-green.svg?style=flat-square)](#contributors)

# Overview
Angular components for enumerating, rendering and interacting with reports hosted in an Azure PowerBI Embed workspace. This package will work with both ng2 and ng4.

# Install
Install via npm:

```
    npm install --save powerbi-ng2
```

# Use
Import the module into your main module (generally app.module.ts):

```
    import { PowerBIModule, ReportsListServiceConfig } from 'powerbi-ng2';

    let _reportsListAPIEndPoint: string = "end point of your reports list Web API enumerating the reports and providing accesss tokens";

    const config:ReportsListServiceConfig = {
        WebAPIServiceUrl: 'end point of your reports list Web API enumerating the reports and providing accesss tokens'
    };

    @NgModule({
        bootstrap: [ ... ],
        declarations: [
            ...
        ],
        imports: [
            PowerBIModule.forRoot(config)
            ...
        ]
    })
```
> <b>Note:</b> This module depends on the [Microsoft PowerBIEmbed Javascript API](https://github.com/Microsoft/PowerBI-JavaScript). Version 2.3.2 and 2.3.3 introduced naming based incompatibilities [See Issue #225](https://github.com/Microsoft/PowerBI-JavaScript/issues/225). Therefore, the module requires 2.3.4 or higher as a dependency. 

> <b>Note:</b> If you use this module in conjunction with Universal (ng2), make sure to include PowerBIModule before UniversalModule as there is a conflict between the standard ng http module imported by it and the ony used by Universal. See [https://github.com/angular/universal-starter/issues/167] and [https://github.com/angular/universal/issues/536#issuecomment-247762794] for more information.

Use the various components inside your angular components. Use the ReportsListService to get a list of available reports from your workspace for navigation purposes and to get embed tokens for a particular report (alternatives, you can use the ReportsList component for that purpose).

Note that the components depend on a service endpoint (_reportsListAPIEndPoint above) for enumreation of reports and token generation. See [Sample Report Service](samples/ReportingApi) for a sample implementation of such a service using .NET Web Api 2.0. 

# Advanced
Check out the [Wiki](../../wiki) for detailed documentation on components, models and providers.
SDK documentation for this project is availabel at [https://infusion-code.github.io/powerbi-ng2/](https://infusion-code.github.io/powerbi-ng2/).
