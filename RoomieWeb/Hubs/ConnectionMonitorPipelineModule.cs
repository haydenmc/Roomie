using Microsoft.AspNet.SignalR.Hubs;
using RoomieWeb.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;

namespace RoomieWeb.Hubs
{
	public class ConnectionMonitorPipelineModule : HubPipelineModule
	{
		protected override object OnAfterIncoming(object result, IHubIncomingInvokerContext context)
		{
			Debug.WriteLine("=> Invoking " + context.MethodDescriptor.Name + " on hub " + context.MethodDescriptor.Hub.Name);
			using (var db = new ApplicationDbContext())
			{
				var connection = db.Connections.Where(c => c.connectionId == context.Hub.Context.ConnectionId).Select(c => c).FirstOrDefault();
				if (connection != null)
				{
					connection.LastActivity = DateTimeOffset.UtcNow;
					db.SaveChanges();
				}
			}
			return base.OnAfterIncoming(result, context);
		}
	}
}