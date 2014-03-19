using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Infrastructure;
using RoomieWeb.Models;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace RoomieWeb.Misc
{
	public class SimpleRefreshTokenProvider : IAuthenticationTokenProvider
	{
		private static ConcurrentDictionary<string, AuthenticationTicket> _refreshTokens = new ConcurrentDictionary<string, AuthenticationTicket>();

		public async Task CreateAsync(AuthenticationTokenCreateContext context)
		{
			using (var db = new ApplicationDbContext())
			{
				var currentUserClaim = (from c in context.Ticket.Identity.Claims
									where c.Type == ClaimTypes.NameIdentifier
									select c).FirstOrDefault();
				if (currentUserClaim == null) {
					throw new UnauthorizedAccessException("Could not validate user.");
				}
				Mate currentUser = db.Users.FirstOrDefault(x => x.Id == currentUserClaim.Value);
				var refreshEntry = new RefreshToken()
				{
					RefreshTokenId = new Guid(),
					Mate = currentUser,
					IssuedTime = DateTime.UtcNow,
					ExpiresTime = DateTime.UtcNow.AddDays(20)
				};
				db.RefreshTokens.Add(refreshEntry);
				db.SaveChanges();
				context.SetToken(refreshEntry.RefreshTokenId.ToString());
			}
		}

		public async Task ReceiveAsync(AuthenticationTokenReceiveContext context)
		{
			using (var db = new ApplicationDbContext())
			{
				var refreshEntry = (from r in db.RefreshTokens
								   where r.RefreshTokenId == new Guid(context.Token)
								   where r.ExpiresTime > DateTime.UtcNow
								   select r).FirstOrDefault();
				if (refreshEntry == null)
				{
					throw new UnauthorizedAccessException("Invalid refresh token.");
				}
				
				var identity = new ClaimsIdentity("Bearer");
				identity.AddClaim(new Claim(ClaimTypes.Name, refreshEntry.Mate.UserName));
				identity.AddClaim(new Claim(ClaimTypes.NameIdentifier, refreshEntry.Mate.Id));

				var refreshTokenProperties = new AuthenticationProperties()
				{
					IssuedUtc = refreshEntry.IssuedTime,
					ExpiresUtc = refreshEntry.ExpiresTime 
				};
				AuthenticationTicket ticket = new AuthenticationTicket(identity,refreshTokenProperties);
				db.RefreshTokens.Remove(refreshEntry);
				db.SaveChanges();
				context.SetTicket(ticket);
			}
		}

		public void Create(AuthenticationTokenCreateContext context)
		{
			throw new NotImplementedException();
		}

		public void Receive(AuthenticationTokenReceiveContext context)
		{
			throw new NotImplementedException();
		}
	}
}