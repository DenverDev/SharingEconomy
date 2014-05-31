using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(SharedEconomy.Startup))]
namespace SharedEconomy
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
