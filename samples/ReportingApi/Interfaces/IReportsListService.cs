using System.Threading.Tasks;
using System.Web.Http;

namespace ReportingApi.Interfaces
{
    /// <summary>
    /// This interface defines the contract for the ReportsListService. When implementing a provider to work with
    /// powerbi-ng2 this interface must be implemented.
    /// </summary>
    interface IReportsListService
    {
        /// <summary>
        /// Gets the reports in the workspace. 
        /// Example: GET: api/Reports
        /// </summary>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        Task<IHttpActionResult> Get(bool includeTokens = false);

        /// <summary>
        /// Gets a specific report. 
        /// Example:  GET: api/Reports/386818d4-f37f-485f-b750-08f982b0c146
        /// </summary>
        /// <param name="id">Id of the report to obtain.</param>
        /// <returns>A ReportWithToken object. The object contains a valid, limited time access token for the report.</returns>
        Task<IHttpActionResult> Get(string id);

        /// <summary>
        /// Retrieves a list of reports based on a query.
        /// </summary>
        /// <param name="query">Query to use to find reports. The query value is used to find reports whos name starts with the query value.</param>
        /// <param name="includeTokens">True to include access tokens for each report.</param>
        /// <returns>List of ReportWithToken objects.</returns>
        Task<IHttpActionResult> SearchByName(string query, bool includeTokens = false);

    }
}
