using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using System.Threading.Tasks;

namespace RoomieWeb.Hubs
{
	public class PadHub : Hub
	{
		public void Hello()
		{
			Clients.All.hello();
		}

		public override Task OnConnected()
		{
			return base.OnConnected();
		}
	}
}