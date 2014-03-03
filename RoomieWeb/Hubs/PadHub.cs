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
			// Check that the user belongs in this pad...
			using (var db = new ApplicationDbContext())
			{
				var user = (from u in db.Users
							where u.Id == user_id
							select u).First();
				if ((from p in user.Pads where p.PadId == new Guid(pad_id) select p).Count() > 0) {
					Clients.Group(pad_id).messageReceived(user.Id, pad_id, body, DateTime.UtcNow);
				}
			}
			
		}

		public override Task OnConnected()
		{
			var user_id = IdentityExtensions.GetUserId(Context.User.Identity);
			using (var db = new ApplicationDbContext())
			{
				var user = (from u in db.Users
							where u.Id == user_id
							select u).First();
				Clients.Caller.systemMessage("You've authenticated and connected! Hi " + user.DisplayName + "!");
				var pads = user.Pads;
				foreach (Pad p in pads)
				{
					Groups.Add(Context.ConnectionId, p.PadId.ToString());
					Clients.Caller.systemMessage("Adding you to '" + p.StreetAddress + "'...");
				}
			}
			return base.OnConnected();
		}
	}
}