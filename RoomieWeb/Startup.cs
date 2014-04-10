using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Owin;
using Owin;
using RoomieWeb.Models;
using Microsoft.AspNet.SignalR;
using RoomieWeb.Hubs;
using Microsoft.AspNet.SignalR.Transports;
using RoomieWeb.Services;

[assembly: OwinStartup(typeof(RoomieWeb.Startup))]

namespace RoomieWeb
{
	public partial class Startup
	{
		public void Configuration(IAppBuilder app)
		{
			ConfigureAuth(app);

			// Set up SignalR
			ITransportHeartbeat heartbeat = GlobalHost.DependencyResolver.Resolve<ITransportHeartbeat>();
			//GlobalHost.HubPipeline.AddModule(new ConnectionMonitorPipelineModule());
			app.MapSignalR();

			var monitor = new ConnectionMonitorService(heartbeat);
			monitor.Start();

			// Clear all old connections
			//using (var db = new ApplicationDbContext())
			//{
			//	db.Database.ExecuteSqlCommand("TRUNCATE TABLE Connections");
			//}
		}
		
	}
}
