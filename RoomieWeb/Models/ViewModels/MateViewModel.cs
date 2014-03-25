using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models.ViewModels
{
	public class MateViewModel
	{
		public string MateId { get; set; }
		public string DisplayName { get; set; }
		public DateTimeOffset JoinTime { get; set; }
	}
}