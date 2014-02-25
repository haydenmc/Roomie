using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models.ViewModels
{
	public class PadViewModel
	{
		public Guid PadId { get; set; }
		public string StreetAddress { get; set; }
		public int ZipCode { get; set; }
	}
}