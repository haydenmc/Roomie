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
				"~/Scripts/jquery.signalR-2.0.2.min.js"));

			bundles.Add(new ScriptBundle("~/bundle/Scripts/ts").Include(
				"~/Scripts/ts/application.js",
				"~/Scripts/ts/page.js",
				"~/Scripts/ts/pages/login.js"));

			bundles.Add(new StyleBundle("~/bundle/Content/css").Include("~/Content/css/*.css", new CssRewriteUrlTransform()));
		}
	}
}
