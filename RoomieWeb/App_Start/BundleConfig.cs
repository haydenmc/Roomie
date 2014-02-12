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
			bundles.Add(new ScriptBundle("~/Scripts/ts").Include(
				"~/Scripts/ts/application.js",
				"~/Scripts/ts/page.js",
				"~/Scripts/ts/pages/login.js"));

			bundles.Add(new StyleBundle("~/Content/css").Include(
				 "~/Content/css/app.css",
				 "~/Content/css/animation.css"));
		}
	}
}
