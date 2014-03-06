using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models.BindingModels
{
	public class InviteBindingModel
	{
		[EmailAddress]
		public string RecipientEmail { get; set; }
		public string PadId { get; set; }
	}
}