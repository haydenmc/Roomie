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
using RoomieWeb.Models.ViewModels;
using RoomieWeb.Hubs;

namespace RoomieWeb.Controllers
{
	[RoutePrefix("api/Invites")]
	[Authorize]
	public class InvitesController : ApiControllerWithHub<PadHub>
	{
		private ApplicationDbContext db = new ApplicationDbContext();

		// GET api/Invites
		/// <summary>
		/// Get the invites sent to the current user.
		/// </summary>
		/// <returns>List of current user's invites.</returns>
		public ICollection<InviteViewModel> GetInvites()
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);
			var invites = from p in db.Invites
				   where p.Recipient.Id == currentUser.Id
				   select new InviteViewModel()
				   {
					   InviteId = p.InviteId,
					   Pad = new PadViewModel()
					   {
						   PadId = p.Pad.PadId,
						   StreetAddress = p.Pad.StreetAddress,
						   ZipCode = p.Pad.ZipCode
					   },
					   Recipient = new MateViewModel()
					   {
						   MateId = p.Recipient.Id,
						   DisplayName = p.Recipient.DisplayName,
						   JoinTime = p.Recipient.JoinTime
					   },
					   Sender = new MateViewModel()
					   {
						   MateId = p.Sender.Id,
						   DisplayName = p.Sender.DisplayName,
						   JoinTime = p.Sender.JoinTime
					   },
					   RecipientEmail = p.RecipientEmail
				   };
			return invites.ToList();
		}

		/// <summary>
		/// Accept an invite to a room
		/// </summary>
		/// <param name="id">ID of the invite</param>
		/// <returns></returns>
		[Route("{id}/Accept")]
		public IHttpActionResult PutAcceptInvite(string id)
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);
			var invites = from i in db.Invites
							where i.InviteId == new Guid(id)
							where i.Recipient.Id == currentUser.Id
							  select i;
			if (invites.Count() <= 0)
			{
				return BadRequest();
			}
			var invite = invites.First();

			// Add user to the referenced pad and delete the invite.
			invite.Pad.Mates.Add(currentUser);
			if (currentUser.Pads != null)
			{
				currentUser.Pads.ToList().Add(invite.Pad);
			}
			else
			{
				currentUser.Pads = new List<Pad>() {
					invite.Pad
				};
			}

			// Gotta get the pad ID from the invite before we remove it...
			string padId = invite.Pad.PadId.ToString();

			db.Invites.Remove(invite);

			db.SaveChanges();

			// Alert pad members that someone has joined
			Hub.Clients.All.systemMessage("It's working");
			Hub.Clients.Group(padId).mateJoined(padId, new MateViewModel()
			{
				MateId = currentUser.Id,
				DisplayName = currentUser.DisplayName,
				JoinTime = currentUser.JoinTime
			});
			return Ok();
		}

		// DELETE /api/Invites/id
		/// <summary>
		/// Used to decline an invite.
		/// </summary>
		/// <param name="id">ID of the invite</param>
		/// <returns></returns>
		[Route("{id}")]
		public IHttpActionResult Delete(string id)
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);
			var invites = from i in db.Invites
						  where i.InviteId == new Guid(id)
						  where i.Recipient.Id == currentUser.Id
						  select i;
			if (invites.Count() <= 0)
			{
				return BadRequest();
			}
			var invite = invites.First();
			db.Invites.Remove(invite);
			return Ok();
		}

		// GET api/Invites/5
		//[ResponseType(typeof(Invite))]
		//public IHttpActionResult GetInvite(Guid id)
		//{
		//	Invite invite = db.Invites.Find(id);
		//	if (invite == null)
		//	{
		//		return NotFound();
		//	}

		//	return Ok(invite);
		//}

		// PUT api/Invites/5
		//public IHttpActionResult PutInvite(Guid id, Invite invite)
		//{
		//	if (!ModelState.IsValid)
		//	{
		//		return BadRequest(ModelState);
		//	}

		//	if (id != invite.InviteId)
		//	{
		//		return BadRequest();
		//	}

		//	db.Entry(invite).State = EntityState.Modified;

		//	try
		//	{
		//		db.SaveChanges();
		//	}
		//	catch (DbUpdateConcurrencyException)
		//	{
		//		if (!InviteExists(id))
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

		// POST api/Invites
		/// <summary>
		/// Invite a user to a pad you belong to.
		/// </summary>
		/// <param name="invite">Invitation</param>
		/// <returns>200 on success, bad request if you've done something wrong.</returns>
		public IHttpActionResult PostInvite(InviteBindingModel invite)
		{
			string currentUserId = User.Identity.GetUserId();
			Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserId);
			if (!ModelState.IsValid)
			{
				return BadRequest(ModelState);
			}
			// Check to see if the target pad exists!
			var pad = from p in db.Pads
					  where p.PadId == new Guid(invite.PadId)
					  select p;
			// If we can't find the pad, or the pad doesn't contain the current User, bad request.
			if (pad.Count() <=0 || !pad.First().Mates.Contains(currentUser)) {
				return BadRequest("Could not find specified pad.");
			}
			// Check to see if the recipient exists!
			var recipient = from m in db.Users
							where m.Email.ToLower() == invite.RecipientEmail
							select m;
			// Make sure an invite to this pad doesn't already exist
			var dupcheck = from i in db.Invites
						   where i.Recipient.Email == invite.RecipientEmail || i.RecipientEmail == invite.RecipientEmail
						   where i.Pad.PadId == new Guid(invite.PadId)
						   select i;
			if (dupcheck.Count() > 0)
			{
				return BadRequest("An invite to this pad has already been sent to this user.");
			}

			Invite inv;
			if (recipient.Count() <= 0)
			{
				inv = new Invite()
				{
					InviteId = new Guid(),
					Sender = currentUser,
					Pad = pad.First(),
					RecipientEmail = invite.RecipientEmail
				};
			}
			else
			{
				inv = new Invite()
				{
					InviteId = new Guid(),
					Sender = currentUser,
					Pad = pad.First(),
					Recipient = recipient.First()
				};
			}

			db.Invites.Add(inv);
			db.SaveChanges();

			return Ok(); // This really should return Created ... but we need a viewmodel.
		}

		// DELETE api/Invites/5
		//[ResponseType(typeof(Invite))]
		//public IHttpActionResult DeleteInvite(Guid id)
		//{
		//	Invite invite = db.Invites.Find(id);
		//	if (invite == null)
		//	{
		//		return NotFound();
		//	}

		//	db.Invites.Remove(invite);
		//	db.SaveChanges();

		//	return Ok(invite);
		//}

		protected override void Dispose(bool disposing)
		{
			if (disposing)
			{
				db.Dispose();
			}
			base.Dispose(disposing);
		}

		private bool InviteExists(Guid id)
		{
			return db.Invites.Count(e => e.InviteId == id) > 0;
		}
	}
}