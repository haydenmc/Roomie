class Application {
	// Running instance reference
	public static instance: Application;
	public static auth_token: string;
	public static refresh_token: string;
	public static identity_email: string;
	public static identity_id: string;
	public static identity_displayname: string;
	public static pad_hub: PadHub;
	public static has_focus: boolean = true;

	// Notification count
	public static notification_count: number = 0;
	public static notification_sound: HTMLAudioElement = new Audio("/Content/snd/update.mp3");

	// Page stack!
	public pages: Page[] = new Array<Page>();

	/* Static Methods */
	public static auth_credentials(username: string, password: string, success: Function, failure: Function) {
		API.token(username, password, (data) => {
			Application.update_auth_parameters(data.access_token, data.refresh_token, data.MateId, username, data.DisplayName);
			success(data);
			setTimeout(() => {
				Application.auth_refresh_interval();
			}, 1000 * 60 * 50);
		}, () => {
			failure();
		});
	}
	public static auth_refresh(token: string, email: string, success: Function, failure: Function) {
		API.refreshtoken(token, email, (data) => {
			Application.update_auth_parameters(data.access_token, data.refresh_token, data.MateId, email, data.DisplayName);
			success(data);
			setTimeout(() => {
				Application.auth_refresh_interval();
			}, 1000 * 60 * 50);
		}, () => {
			failure();
		});
	}

	public static auth_refresh_interval(tries?: number) {
		if (tries === undefined) tries = 0;
		Application.auth_refresh(Application.refresh_token, Application.identity_email, () => {
			setTimeout(() => {
				Application.auth_refresh_interval();
			}, 1000*60*50); // Refresh our auth token every 50 min.
		}, () => {
			console.log("Refresh token interval failure... trying again real quick...");
			if (tries < 3)
			{
				setTimeout(() => {
					Application.auth_refresh_interval(tries + 1);
				}, 3000);
			} else {
				console.log("Refresh auth failed. Logging out...");
				Application.instance.logOut();
			}
		});
	}
	public static update_auth_parameters(auth_token: string, refresh_token: string, mateid: string, email: string, displayname: string) {
		// Set application parameters
		Application.auth_token = auth_token;
		Application.refresh_token = refresh_token;
		Application.identity_email = email;
		Application.identity_id = mateid;
		Application.identity_displayname = displayname;
		// Set cookies
		var expireDate: Date = new Date();
		expireDate.setDate(expireDate.getDate() + 7);
		Cookies.set_cookie("refresh_token", refresh_token, expireDate);
		Cookies.set_cookie("identity_email", email, expireDate);
		// Reconnect hub if it's not present.
		if (!Application.pad_hub) {
			Application.pad_hub = new PadHub();
		}
		Application.pad_hub.connect();
	}

	constructor() {
		Application.instance = this;

		window.onfocus = (evt) => {
			this.onFocus();
		}
		window.onblur = (evt) => {
			this.onBlur();
		}
	}

	/**
	 * onFocus
	 * Occurs when the page is put into focus by the user.
	 */
	public onFocus(): void {
		Application.has_focus = true;
		this.setNotificationCount(0);
		this.updateTitle();
	}

	/**
	 * onBlur
	 * Occurs when the page loses focus.
	 */
	public onBlur(): void {
		Application.has_focus = false;
	}

	/**
	 * addNotification
	 * Adds one to the notification count and updates title / makes sound / etc.
	 */
	public addNotification(): void {
		if (Application.has_focus) {
			return; // Return if we're looking at the window.
		}
		Application.notification_count++;
		Application.notification_sound.play();
		this.updateTitle();
	}

	/**
	 * setNotificationCount
	 * Sets the count of notifications to the specified amount.
	 */
	public setNotificationCount(count: number) {
		Application.notification_count = count;
		this.updateTitle();
	}

	/**
	 * Updates the title of the window with the current page name and
	 * notification count.
	 */
	public updateTitle() {
		var notification = "";
		if (Application.notification_count > 0) {
			notification = "(" + Application.notification_count + ") ";
		}
		if (this.pages.length > 0 && this.pages[this.pages.length - 1].title.length > 0) {
			document.title = notification + "roomie / " + this.pages[this.pages.length - 1].title;
		} else {
			document.title = notification + "roomie";
		}
	}

	/**
	 * logOut
	 * Logs the user out, resets cookies, returns to log in page.
	 */
	public logOut(): void {
		Application.auth_token = null;
		Application.refresh_token = null;
		Application.identity_email = null;
		Application.identity_id = null;
		Application.identity_displayname = null;
		Cookies.delete_cookie("refresh_token");
		Cookies.delete_cookie("identity_email");
		//Cookies.delete_cookie(".AspNet.Cookies"); // Delete ASP Identity Cookies, too.
		//TODO: ASPNET AUTH COOKIE IS NEVER REMOVED! This has to be done from the server side.
		Application.pad_hub.disconnect();
		// Application.pad_hub = null; // Should only ever create one instance of this.
		this.clearPages();
		Application.instance.navigateTo(new LogIn());
	}

	/**
	 * clearPages
	 * Clears the page stack history and hides the last page present.
	 */
	public clearPages(): void {
		if (this.pages.length >= 1) {
			this.pages[this.pages.length - 1].hide();
		}
		this.pages = new Array<Page>();
	}

	/**
	 * navigateTo
	 * Navigate to a specific page and add it to the page stack.
	 */
	public navigateTo(page: Page): void {
		this.pages.push(page);
		if (this.pages.length > 1) {
			this.pages[this.pages.length - 2].hide();
		}
		this.pages[this.pages.length - 1].show();
		this.updateTitle();
	}

	/**
	 * navigateBack
	 * Navigate back to the previous page, removing current page from page stack.
	 */
	public navigateBack(): void {
		if (this.pages.length > 1) {
			this.pages.pop().hide();
			this.pages[this.pages.length - 1].show();
			this.updateTitle();
		}
	}

	/**
	 * canGoBack
	 * Returns true if there is enough room on the page stack to go back.
	 * False otherwise.
	 */
	public canGoBack(): boolean {
		return (this.pages.length > 1);
	}

	/**
	 * hasPages
	 * Returns true if the page stack has at least one page.
	 */
	public hasPages(): boolean{
		return (this.pages.length > 0);
	}
}

/* Some global functions for browser compatibility, etc. */
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
	for (var p = 0; p < pfx.length; p++) {
		if (!pfx[p]) {
			type = type.toLowerCase();
		}
		element.addEventListener(pfx[p] + type, callback, false);
	}
}

function htmlEscape(str) {
	return String(str)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

(<any>String).prototype.hashCode = function () {
	var hash = 0;
	if (this.length == 0) return hash;
	for (var i = 0; i < this.length; i++) {
		var char = this.charCodeAt(i);
		hash += char;
	}
	return hash;
}

function guidToColor(guid: string): string {
	if (!guid) {
		return 'hsl(0, 100%, 70%)';
	}
	var color = Math.abs((<any>guid).hashCode()) % 360;
	return 'hsl(' + color + ', 100%, 70%)';
}

window.onload = function () {
	var a: Application = new Application();

	// Check to see if we have a refresh token saved as a cookie.
	var refresh_token = Cookies.get_cookie("refresh_token");
	var identity_email = Cookies.get_cookie("identity_email");
	if (refresh_token == null || identity_email == null) {
		// If not, show log in page.
		a.navigateTo(new LogIn());
	} else {
		// Use the refresh token to request a new auth token
		Progress.show();
		Application.auth_refresh(refresh_token, identity_email, (data) => {
			// On success, navigate to hub.
			Progress.hide();
			a.clearPages();
			a.navigateTo(new Hub());
		}, () => {
			// On failure, 'log out'.
			Progress.hide();
			Application.instance.logOut();
		});
	}
};

// Fix for Windows Phone device width. Hideous...
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
	var msViewportStyle = document.createElement("style");
	msViewportStyle.appendChild(
		document.createTextNode(
			"@-ms-viewport{width:auto!important}"
			)
		);
	document.getElementsByTagName("head")[0].
		appendChild(msViewportStyle);
}