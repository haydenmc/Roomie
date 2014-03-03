using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models.ViewModels
{
	public class MessageViewModel
	{
		public Guid MessageId { get; set; }
		public Guid MateId { get; set; }
		public Guid PadId { get; set; }
		public string Body { get; set; }
		public DateTime SendTime { get; set; }
	}
}