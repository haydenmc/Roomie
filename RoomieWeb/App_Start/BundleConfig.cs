using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Optimization;

namespace RoomieWeb
{
	public class BundleConfig
	{
		// For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
		public static void RegisterBundles(BundleCollection bundles)
		{
			bundles.Add(new ScriptBundle("~/bundle/Scripts/js").Include(
				"~/Scripts/jquery-1.6.4.min.js",
				"~/Scripts/jquery.signalR-2.0.2.min.js",
				"~/Scripts/Autolinker.min.js"));

			bundles.Add(new ScriptBundle("~/bundle/Scripts/ts").Include(
				"~/Scripts/ts/application.js",
				"~/Scripts/ts/authentication.js",
				"~/Scripts/ts/cookies.js",
				"~/Scripts/ts/API.js",
				"~/Scripts/ts/progress.js",
				"~/Scripts/ts/animation.js",
				"~/Scripts/ts/hubs/padhub.js",
				"~/Scripts/ts/page.js",
				"~/Scripts/ts/dialog.js",
				"~/Scripts/ts/dialogs/invitedialog.js",
				"~/Scripts/ts/dialogs/myinvitesdialog.js",
				"~/Scripts/ts/dialogs/medialog.js",
				"~/Scripts/ts/pages/login.js",
				"~/Scripts/ts/pages/register.js",
				"~/Scripts/ts/pages/newpad.js",
				"~/Scripts/ts/pages/hub.js",
				"~/Scripts/ts/pages/pad.js"));
			
			bundles.Add(new StyleBundle("~/bundle/Content/css").Include("~/Content/css/*.css", new CssRewriteUrlTransform()));

			#if DEBUG
				BundleTable.EnableOptimizations = false;
			#else
				BundleTable.EnableOptimizations = true;
			#endif
		}
	}
}
