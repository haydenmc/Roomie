using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models.ViewModels
{
	public class InviteViewModel
	{
		public Guid InviteId { get; set; }
		public MateViewModel Sender { get; set; }
		public MateViewModel Recipient { get; set; }
		public string RecipientEmail { get; set; }
		public PadViewModel Pad { get; set; }
	}
}