using Microsoft.AspNet.Identity.EntityFramework;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class ApplicationDbContext : IdentityDbContext<Mate>
	{
		public ApplicationDbContext()
			: base("ApplicationDbContext")
		{

		}
	}
}