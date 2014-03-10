using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;
using Microsoft.AspNet.Identity;
using RoomieWeb.Models;

namespace RoomieWeb.Hubs
{
	[Authorize]
	public class PadHub : Hub
	{
		public void SendMessage(string pad_id, string body)
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			body = body.Trim();
			if (body.Length <= 0)
			{
				return;
			}
			// Check that the user belongs in this pad...
			using (var db = new ApplicationDbContext())
			{
				var user = (from u in db.Users
							where u.Id == user_id
							select u).First();
				var pads = (from p in user.Pads where p.PadId == new Guid(pad_id) select p);
				if (pads.Count() > 0) {
					var pad = pads.First();
					// Save the message to the database
					var msg = new Message()
					{
						MessageId = new Guid(),
						Author = user,
						Body = body,
						SendTime = DateTime.UtcNow,
						Pad = pads.First()
					};
					pad.Messages.Add(msg);
					db.Messages.Add(msg);
					db.SaveChanges();
					// Send the message to all clients
					Clients.Group(pad_id).messageReceived(user.Id, pad_id, body, DateTime.UtcNow);
				}
			}
			
		}

		public override Task OnConnected()
		{
			this.RefreshGroups();
			//var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			//using (var db = new ApplicationDbContext())
			//{
			//	var user = (from u in db.Users
			//				where u.Id == user_id
			//				select u).First();
			//	Clients.Caller.systemMessage("You've authenticated and connected! Hi " + user.DisplayName + "!");
			//	var pads = user.Pads;
			//	foreach (Pad p in pads)
			//	{
			//		Groups.Add(Context.ConnectionId, p.PadId.ToString());
			//		Clients.Caller.systemMessage("Adding you to '" + p.StreetAddress + "'...");
			//	}
			//}
			return base.OnConnected();
		}

		public void RefreshGroups()
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			using (var db = new ApplicationDbContext())
			{
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
}