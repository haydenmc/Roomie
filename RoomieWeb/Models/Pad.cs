using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RoomieWeb.Models
{
	public class Pad
	{
		[Key]
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public Guid PadId { get; set; }
		public string StreetAddress { get; set; }
		public int ZipCode { get; set; }
		public virtual ICollection<Mate> Mates { get; set; }
	}
}