using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using RoomieWeb.Models;
using Microsoft.AspNet.Identity;
using RoomieWeb.Models.BindingModels;
using System.Data.Entity.Validation;
using RoomieWeb.Models.ViewModels;

namespace RoomieWeb.Controllers
{
	public class PadController : ApiController
	{
		private ApplicationDbContext db = new ApplicationDbContext();

		// GET api/Pad
		[Authorize]
		public ICollection<PadViewModel> GetPads()
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);
			var Results = from p in currentUser.Pads
						  select new PadViewModel()
						  {
							  PadId = p.PadId,
							  StreetAddress = p.StreetAddress,
							  ZipCode = p.ZipCode
						  };
			return Results.ToList();
			//return db.Pads;
		}

		// GET api/Pad/5
		[ResponseType(typeof(Pad))]
		public IHttpActionResult GetPad(string id)
		{
			Pad pad = db.Pads.Find(id);
			if (pad == null)
			{
				return NotFound();
			}

			return Ok(pad);
		}

		// PUT api/Pad/5
		public IHttpActionResult PutPad(string id, Pad pad)
		{
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}

			if (id != pad.PadId.ToString())
			{
				return BadRequest();
			}

			db.Entry(pad).State = EntityState.Modified;

			try
			{
				db.SaveChanges();
			}
			catch (DbUpdateConcurrencyException)
			{
				if (!PadExists(id))
				{
					return NotFound();
				}
				else
				{
					throw;
				}
			}

			return StatusCode(HttpStatusCode.NoContent);
		}

		// POST api/Pad
		[ResponseType(typeof(PadViewModel))]
		[Authorize]
		public IHttpActionResult PostPad(PadBindingModel pad)
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);

			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			var newPad = new Pad()
			{
				PadId = new Guid(),
				StreetAddress = pad.StreetAddress,
				ZipCode = pad.ZipCode
			};
			newPad.Mates = new List<Mate>() {
				currentUser
			};

			db.Pads.Add(newPad);

			if (currentUser.Pads != null) {
				currentUser.Pads.ToList().Add(newPad);
			}
			else
			{
				currentUser.Pads = new List<Pad>() {
					newPad
				};
			}
			db.SaveChanges();
			return CreatedAtRoute("DefaultApi", new { id = newPad.PadId }, new PadViewModel()
			{
				PadId = newPad.PadId,
				StreetAddress = newPad.StreetAddress,
				ZipCode = newPad.ZipCode
			});
		}

		// DELETE api/Pad/5
		[ResponseType(typeof(Pad))]
		public IHttpActionResult DeletePad(string id)
		{
			Pad pad = db.Pads.Find(id);
			if (pad == null)
			{
				return NotFound();
			}

			db.Pads.Remove(pad);
			db.SaveChanges();

			return Ok(pad);
		}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}

		private bool PadExists(string id)
		{
			return db.Pads.Count(e => e.PadId.ToString() == id) > 0;
		}
	}
}