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
using RoomieWeb.Hubs;

namespace RoomieWeb.Controllers
{
	[RoutePrefix("api/Pad")]
	public class PadController : ApiControllerWithHub<PadHub>
	{
		private ApplicationDbContext db = new ApplicationDbContext();

		// GET api/Pad
		/// <summary>
		/// Gets a list of the current user's Pads.
		/// </summary>
		/// <returns>Array of pad objects that the user belongs to.</returns>
		[Route("")]
		[Authorize]
		public ICollection<PadViewModel> Get()
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
		/// <summary>
		/// Gets details of a specific pad.
		/// </summary>
		/// <param name="id">GUID of the pad to fetch details for.</param>
		/// <returns>Pad object with pad's details</returns>
		[Route("{id}")]
		[ResponseType(typeof(PadViewModel))]
		public IHttpActionResult Get(string id)
		{
			Pad pad = db.Pads.Find(id);
			if (pad == null)
			{
				return NotFound();
			}

			return Ok(new PadViewModel()
			{
				PadId = pad.PadId,
				StreetAddress = pad.StreetAddress,
				ZipCode = pad.ZipCode
			});
		}

		// PUT api/Pad/5
		//[Route("{id}")]
		//public IHttpActionResult Put(string id, Pad pad)
		//{
		//	if (!ModelState.IsValid)
		//	{
		//		return BadRequest(ModelState);
		//	}

		//	if (id != pad.PadId.ToString())
		//	{
		//		return BadRequest();
		//	}

		//	db.Entry(pad).State = EntityState.Modified;

		//	try
		//	{
		//		db.SaveChanges();
		//	}
		//	catch (DbUpdateConcurrencyException)
		//	{
		//		if (!PadExists(id))
		//		{
		//			return NotFound();
		//		}
		//		else
		//		{
		//			throw;
		//		}
		//	}

		//	return StatusCode(HttpStatusCode.NoContent);
		//}

		// POST api/Pad
		[Route("")]
		[ResponseType(typeof(PadViewModel))]
		[Authorize]
		public IHttpActionResult Post(PadBindingModel pad)
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
			return Created(new Uri("/api/Pad/" + newPad.PadId,UriKind.Relative), new PadViewModel()
			{
				PadId = newPad.PadId,
				StreetAddress = newPad.StreetAddress,
				ZipCode = newPad.ZipCode
			});
		}

		// DELETE api/Pad/5
		/// <summary>
		/// Causes the current user to leave the specified pad. If pad is empty, it is deleted.
		/// </summary>
		/// <param name="id">ID of the pad to leave.</param>
		/// <returns></returns>
		[Route("{id}")]
		[ResponseType(typeof(Pad))]
		public IHttpActionResult Delete(string id)
		{
			//Pad pad = db.Pads.Find(id);
			//if (pad == null)
			//{
			//	return NotFound();
			//}

			//db.Pads.Remove(pad);
			//db.SaveChanges();

			//return Ok(pad);
			return Ok();
		}

		/// <summary>
		/// Get the list of mates that belong to a pad.
		/// </summary>
		/// <param name="id">ID of the pad</param>
		/// <returns>Array of mate objects</returns>
		[Route("{id}/Mates")]
		[ResponseType(typeof(IEnumerable<MateViewModel>))]
		[Authorize]
		public IHttpActionResult GetMates(string id)
		{
			var padGuid = new Guid(id);
			//var Pad = db.Pads.Find(id);
			var R = (from p in db.Pads
					 where p.PadId == padGuid
					 from m in p.Mates
					 select m).ToList();
			var V = from m in R
					select m.toViewModel();
			//var R = db.Pads.Where(p => p.PadId == padGuid).Include(p => p.Mates.Select(m => m.Connections)).Select(p => p.Mates.Select(m => m));
			return Ok(V);
		}
		[Route("{id}/Messages")]
		[ResponseType(typeof(IEnumerable<MessageViewModel>))]
		[Authorize]
		public IHttpActionResult GetMessages(string id)
		{
			var padGuid = new Guid(id);
			
			// Try to find the pad referenced by the passed ID
			var pads = (from p in db.Pads
						where p.PadId == padGuid
						select p).Include(p => p.Messages);
			if (pads.Count() <= 0)
			{
				return NotFound();
			}
			var pad = pads.First();

			// Grab the last 25 messages in this pad.
			var messages = db.Pads.Where(p => p.PadId == pad.PadId)
							.SelectMany(p => p.Messages.OrderByDescending(m => m.SendTime).Take(25))
							.ToList();
			messages.Reverse();
			var messagesmodel = from m in messages
				   select m.toViewModel();
			return Ok(messagesmodel);
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