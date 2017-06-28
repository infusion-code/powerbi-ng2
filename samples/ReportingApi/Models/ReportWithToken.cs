using Microsoft.PowerBI.Api.V1.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReportingApi.Models
{
    /// <summary>
    /// Represents a report with a valid access token.
    /// </summary>
    public class ReportWithToken : Report
    {
        /// <summary>
        /// Gets or sets the object type. Defaults to 'report'.
        /// </summary>
        public string type { get; set; }

        /// <summary>
        /// Gets or sets the access token.
        /// </summary>
        public string accessToken { get; set; }

        /// <summary>
        /// Creates a new instance of the ReportWithToken class.
        /// </summary>
        /// <param name="report">The report name.</param>
        /// <param name="token">The access token.</param>
        public ReportWithToken(Report report, string token = null)
            : base(report.Id, report.Name, report.WebUrl, report.EmbedUrl)
        {
            type = "report";
            accessToken = token;
        }
    }
}