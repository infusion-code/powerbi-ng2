using System.Threading.Tasks;
using System.Web.Http;

namespace ReportingApi.Interfaces
{
    /// <summary>
    /// Abstract implmenting the IReportsListService contract with concrete routes and decorators. Services wanting to implement IReportsListService
    /// should implement this abstract to ensure proper routes and parameter extraction.
    /// </summary>
    [RoutePrefix("api")]
    public abstract class ReportsListService: ApiController, IReportsListService
    {
        /// <summary>
        /// Gets the reports in the workspace. 
        /// Example: GET: api/Reports
        /// </summary>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        [Route(@"reports")]
        public abstract Task<IHttpActionResult> Get([FromUri]bool includeTokens = false);

        /// <summary>
        /// Gets a specific report. 
        /// Example:  GET: api/Reports/386818d4-f37f-485f-b750-08f982b0c146
        /// </summary>
        /// <param name="id">Id of the report to obtain.</param>
        /// <returns>A ReportWithToken object. The object contains a valid, limited time access token for the report.</returns>
        [Route(@"reports/{id}")]
        public abstract Task<IHttpActionResult> Get([FromUri]string id);

        /// <summary>
        /// Retrieves a list of reports based on a query.
        /// </summary>
        /// <param name="query">Query to use to find reports. The query value is used to find reports whos name starts with the query value.</param>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        [Route(@"reports/{query}")]
        public abstract Task<IHttpActionResult> SearchByName([FromUri]string query, [FromUri]bool includeTokens = false);

    }
}
