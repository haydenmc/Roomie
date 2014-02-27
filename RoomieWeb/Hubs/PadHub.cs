using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;

namespace RoomieWeb.Hubs
{
	public class PadHub : Hub
	{
		public void Hello()
		{
			Clients.All.hello();
		}
	}
}