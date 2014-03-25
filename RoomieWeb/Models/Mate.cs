using Microsoft.AspNet.Identity.EntityFramework;
using RoomieWeb.Models.ViewModels;
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
		public DateTimeOffset JoinTime { get; set; }

		public virtual ICollection<Pad> Pads { get; set; }

		public MateViewModel toViewModel() {
			return new MateViewModel()
			{
				MateId = this.Id,
				DisplayName = this.DisplayName,
				JoinTime = this.JoinTime
			};
		}
	}
}