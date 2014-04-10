using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class Connection
	{
		[Key]
		public string connectionId { get; set; }
		public virtual Mate User { get; set; }
		public string UserAgent { get; set; }
		public DateTimeOffset StartTime { get; set; }
		public DateTimeOffset LastActivity { get; set; }
	}
}