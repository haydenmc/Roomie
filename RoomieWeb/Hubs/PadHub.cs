using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using RoomieWeb.Models;
using RoomieWeb.Models.ViewModels;

namespace RoomieWeb.Hubs
{
	[Authorize]
	public class PadHub : Hub
	{
		private ApplicationDbContext db = new ApplicationDbContext();
		public void SendMessage(string pad_id, string body)
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			body = body.Trim();
			if (body.Length <= 0)
			{
				return;
			}
			// Check that the user belongs in this pad...
			var user = (from u in db.Users
						where u.Id == user_id
						select u).First();
			var pad = (from p in user.Pads where p.PadId == new Guid(pad_id) select p).FirstOrDefault();
			if (pad != null) {
				// Save the message to the database
				var msg = new Message()
				{
					MessageId = new Guid(),
					Author = user,
					Body = body,
					SendTime = DateTimeOffset.UtcNow,
					Pad = pad
				};
				
				pad.Messages.Add(msg);
				db.Messages.Add(msg);
				db.SaveChangesAsync();
				Clients.Group(pad_id).messageReceived(user.Id, pad_id, body, DateTimeOffset.UtcNow); //Perf test.
				
			}
		}

		public void Typing(string pad_id)
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			var user = (from u in db.Users
						where u.Id == user_id
						select u).First();
			var pads = (from p in user.Pads where p.PadId == new Guid(pad_id) select p);
			if (pads.Count() > 0)
			{
				var pad = pads.First();
				Clients.Group(pad_id).typingReceived(pad_id, user.toViewModel());
			}
		}

		public override Task OnConnected()
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			var user = (from u in db.Users
						where u.Id == user_id
						select u).First();
			var conn = new Connection()
			{
				connectionId = Context.ConnectionId,
				User = user,
				UserAgent = Context.Request.Headers["User-Agent"],
				StartTime = DateTimeOffset.UtcNow
			};
			db.Connections.Add(conn);
			db.SaveChanges();

			// Notify everyone you're online
			var uservm = user.toViewModel();
			foreach (var p in user.Pads)
			{
				Clients.Group(p.PadId.ToString()).mateOnline(uservm);
			}
			this.RefreshGroups();
			return base.OnConnected();
		}

		public override Task OnDisconnected()
		{
			var connection = (from c in db.Connections
								where c.connectionId == Context.ConnectionId
									select c).FirstOrDefault();
			if (connection == null)
			{
				return base.OnDisconnected();
			}
			var user = connection.User;

			// Notify everyone you're offline
			if (user.Connections.Count() == 1)
			{
				var uservm = user.toViewModel();
				foreach (var p in user.Pads)
				{
					Clients.Group(p.PadId.ToString()).mateOffline(uservm);
				}
			}
				
			if (connection != null)
			{
				db.Connections.Remove(connection);
				db.SaveChanges();
			}
			return base.OnDisconnected();
		}

		public void RefreshGroups()
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			var user = (from u in db.Users
						where u.Id == user_id
						select u).First();
			var pads = user.Pads;
			foreach (Pad p in pads)
			{
				Groups.Add(Context.ConnectionId, p.PadId.ToString());
				Clients.Caller.systemMessage("Adding you to '" + p.StreetAddress + "'...");
			}
			Groups.Add(Context.ConnectionId, user.Id.ToString());
		}
	}
}