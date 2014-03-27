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

		public DbSet<Connection> Connections { get; set; }
		public DbSet<Pad> Pads { get; set; }
		public DbSet<Message> Messages { get; set; }
		public DbSet<Invite> Invites { get; set; }
		public DbSet<RefreshToken> RefreshTokens { get; set; }
	}
}