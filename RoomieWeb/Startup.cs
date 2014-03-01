using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(RoomieWeb.Startup))]

namespace RoomieWeb
{
	public partial class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureAuth(app);

			// Set up SignalR
			app.MapSignalR();
		}
	}
}
