using Swashbuckle.Application;
using System.Configuration;
using System.Web.Http;
using System.Web.Http.Cors;

namespace ReportingApi
{
    /// <summary>
    /// Default Web Api Config.
    /// </summary>
    public static class WebApiConfig
    {
        /// <summary>
        /// Static method to register routes.
        /// </summary>
        /// <param name="config">Http Configuration.</param>
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            // Configure CORS 
            string allowedClients = ConfigurationManager.AppSettings["powerbi:AllowedCORSClients"];
            if (string.IsNullOrEmpty(allowedClients)) allowedClients = "*";
            config.EnableCors(new EnableCorsAttribute(allowedClients, "*", "*") { SupportsCredentials = true});

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
                name: "swagger",
                routeTemplate: "",
                defaults: null,
                constraints: null,
                handler: new RedirectHandler((message => message.RequestUri.ToString()), "swagger"));
        }
    }
}
