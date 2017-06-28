using Microsoft.PowerBI.Api.V1;
using Microsoft.PowerBI.Security;
using Microsoft.Rest;
using ReportingApi.Models;
using System;
using System.Configuration;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ReportingApi.Service
{
    /// <summary>
    /// Implements the reporting API controller. Note that the cors configuration is done in the WebApiConfig.cs.
    /// </summary>
    [RoutePrefix("api")]
    public class ReportsController : ReportingApi.Interfaces.ReportsListService, ReportingApi.Interfaces.IReportsListService
    {
        private string workspaceCollectionName;
        private Guid workspaceId;
        private string workspaceCollectionAccessKey;
        private string apiUrl;
        
        /// <summary>
        /// Creates a new instane of the ReportsController
        /// </summary>
        public ReportsController()
        {
            // get configuration parameters from web.config.
            this.workspaceCollectionName = ConfigurationManager.AppSettings["powerbi:WorkspaceCollectionName"];
            this.workspaceId = Guid.Parse(ConfigurationManager.AppSettings["powerbi:WorkspaceId"]);
            this.workspaceCollectionAccessKey = ConfigurationManager.AppSettings["powerbi:WorkspaceCollectionAccessKey"];
            this.apiUrl = ConfigurationManager.AppSettings["powerbi:ApiUrl"];
        }
        
        /// <summary>
        /// Gets the reports in the workspace. 
        /// Example: GET: api/Reports
        /// </summary>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        [Route(@"reports")]
        public override async Task<IHttpActionResult> Get([FromUri]bool includeTokens = false)
        {
            var credentials = new TokenCredentials(workspaceCollectionAccessKey, "AppKey");
            using (var client = new PowerBIClient(new Uri(apiUrl), credentials))
            {
                var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollectionName, this.workspaceId.ToString());
                var reportsWithTokens = reportsResponse.Value
                    .Select(report =>
                    {
                        string accessToken = null;
                        if(includeTokens)
                        {
                            var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollectionName, this.workspaceId.ToString(), report.Id);
                            accessToken = embedToken.Generate(this.workspaceCollectionAccessKey);
                        }

                        return new ReportWithToken(report, accessToken);
                    })
                    .ToList();

                return Ok(reportsWithTokens);
            }
        }

        /// <summary>
        /// Gets a specific report. 
        /// Example:  GET: api/Reports/386818d4-f37f-485f-b750-08f982b0c146
        /// </summary>
        /// <param name="id">Id of the report to obtain.</param>
        /// <returns>A ReportWithToken object. The object contains a valid, limited time access token for the report.</returns>
        [Route(@"reports/{id}")]
        public override async Task<IHttpActionResult> Get([FromUri]string id)
        {
            var credentials = new TokenCredentials(workspaceCollectionAccessKey, "AppKey");
            using (var client = new PowerBIClient(new Uri(apiUrl), credentials))
            {
                var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollectionName, this.workspaceId.ToString());
                var report = reportsResponse.Value.FirstOrDefault(r => r.Id == id);
                if(report == null)
                {
                    return BadRequest($"No reports were found matching the id: {id}");
                }

                var embedToken = PowerBIToken.CreateReportEmbedToken(workspaceCollectionName, workspaceId.ToString(), report.Id);
                var accessToken = embedToken.Generate(workspaceCollectionAccessKey);
                var reportWithToken = new ReportWithToken(report, accessToken);

                return Ok(reportWithToken);
            }
        }

        /// <summary>
        /// Retrieves a list of reports based on a query.
        /// </summary>
        /// <param name="query">Query to use to find reports. The query value is used to find reports whos name starts with the query value.</param>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        [Route(@"reports/{query}")]
        public override async Task<IHttpActionResult> SearchByName([FromUri]string query, [FromUri]bool includeTokens = false)
        {
            if(string.IsNullOrWhiteSpace(query))
            {
                return Ok(Enumerable.Empty<ReportWithToken>());
            }

            var credentials = new TokenCredentials(workspaceCollectionAccessKey, "AppKey");
            using (var client = new PowerBIClient(new Uri(apiUrl), credentials))
            {
                var reportsResponse = await client.Reports.GetReportsAsync(this.workspaceCollectionName, this.workspaceId.ToString());
                var reports = reportsResponse.Value.Where(r => r.Name.ToLower().StartsWith(query.ToLower()));

                var reportsWithTokens = reports
                    .Select(report =>
                     {
                         string accessToken = null;
                         if (includeTokens)
                         {
                             var embedToken = PowerBIToken.CreateReportEmbedToken(this.workspaceCollectionName, this.workspaceId.ToString(), report.Id);
                             accessToken = embedToken.Generate(this.workspaceCollectionAccessKey);
                         }

                         return new ReportWithToken(report, accessToken);
                     })
                    .ToList();

                return Ok(reportsWithTokens);
            }
        }
    }
}
