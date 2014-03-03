using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class Message
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid MessageId { get; set; }
		public virtual Mate Author { get; set; }
		public virtual Pad Pad { get; set; }
		public string Body { get; set; }
		public DateTime SendTime { get; set; }
	}
}