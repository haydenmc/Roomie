using Microsoft.Owin.Security;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class RefreshToken
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid RefreshTokenId { get; set; }
		public virtual Mate Mate { get; set; }
		public DateTimeOffset IssuedTime { get; set; }
		public DateTimeOffset ExpiresTime { get; set; }
	}
}