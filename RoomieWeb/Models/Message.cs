using RoomieWeb.Models.ViewModels;
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
		public DateTimeOffset SendTime { get; set; }

		public MessageViewModel toViewModel()
		{
			return new MessageViewModel()
			{
				MessageId = this.MessageId,
				MateId = new Guid(this.Author.Id),
				PadId = this.Pad.PadId,
				Body = this.Body,
				SendTime = this.SendTime
			};
		}
	}
}