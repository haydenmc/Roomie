using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class Invite
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid InviteId { get; set; }
		public virtual Mate Sender { get; set; }
		public virtual Mate Recipient { get; set; }
		public string RecipientEmail { get; set; }
		public virtual Pad Pad { get; set; }
	}
}