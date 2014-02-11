using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class Mate : IdentityUser
	{
		public string Email
		{
			get
			{
				return UserName;
			}
			set
			{
				UserName = value;
			}
		}
		public string DisplayName { get; set; }
		public DateTime JoinTime { get; set; }
	}
}