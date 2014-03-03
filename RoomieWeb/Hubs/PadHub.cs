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
	public class PadHub : Hub
	{
		public void JoinPads(string auth_token)
		{
			var ticket = Startup.OAuthOptions.AccessTokenFormat.Unprotect(auth_token);
			bool isAuth = ticket.Identity.IsAuthenticated;
			var user_id = IdentityExtensions.GetUserId(ticket.Identity);
			var guid = new Guid(user_id);
			using (var db = new ApplicationDbContext())
			{
				var user = (from u in db.Users
						   where u.Id == user_id
							   select u).First();
				Clients.Caller.systemMessage("You've authenticated and connected! Hi " + user.DisplayName + "!");
			}
		}
		public void SendMessage(string pad_id, string body)
		{
			Clients.Group(pad_id).messageReceived("", pad_id, body);
		}

		public override Task OnConnected()
		{
			return base.OnConnected();
		}
	}
}