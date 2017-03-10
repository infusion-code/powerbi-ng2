# Overview
Angular2 components for enumerating, rendering and interacting with reports hosted in an Azure PowerBI Embed workspace.

# Install
Install via npm:

```
    npm install --save powerbi-ng2
```

# Use
Import the module into your main module (generally app.module.ts):

```
    import { PowerBIModule } from 'powerbi-ng2';

    @NgModule({
        bootstrap: [ ... ],
        declarations: [
            ...
        ],
        imports: [
            ...
            PowerBIModule,
            ...
        ]
    })
```
Use the various components inside your ng2 components. Use the ReportsListService to get a list of available reports from your workspace for navigation purposes and to get embed tokens for a particular report (alternatives, you can use the ReportsList component for that purpose).

Note that the components depend on a service endpoint for enumreation of reports and token generation. See [[To be created]] for a sample implementation of such a service using .NET Web Api 2.0. 

# Advanced
Check out the [Wiki](../../wiki) for detailed documentation on components, models and providers.