using Microsoft.AspNet.SignalR.Transports;
using RoomieWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;

namespace RoomieWeb.Services
{
	public class ConnectionMonitorService
	{
		private readonly ITransportHeartbeat _heartbeat;
		private Timer _timer;
		private readonly TimeSpan _presenceCheckInterval = TimeSpan.FromSeconds(30);

		public ConnectionMonitorService(ITransportHeartbeat heartbeat)
		{
			_heartbeat = heartbeat;
		}

		public void Start()
		{
			System.Diagnostics.Debug.WriteLine("Connection monitor started...");
			// Start the timer
			_timer = new Timer(_ =>
			{
				Check();
			},
			null,
			TimeSpan.Zero,
			_presenceCheckInterval);
		}

		private void Check()
		{
			System.Diagnostics.Debug.WriteLine("Connection monitor checking...");
			using (var db = new ApplicationDbContext())
			{ 
				// Get all connections on this node and update the activity
				foreach (var connection in _heartbeat.GetConnections())
				{
					if (!connection.IsAlive)
					{
						continue;
					}

					Connection db_conn = db.Connections.Where(c => c.connectionId == connection.ConnectionId).Select(c => c).FirstOrDefault();
					System.Diagnostics.Debug.WriteLine("\t User "+db_conn.User.Id.ToString());
					if (db_conn != null)
					{
						db_conn.LastActivity = DateTimeOffset.UtcNow;
					}
				}
				db.SaveChanges();
			}
		}

	}
}