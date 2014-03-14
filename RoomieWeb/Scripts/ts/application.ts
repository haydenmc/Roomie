class Application {
	// Running instance reference
	public static instance: Application;
	public static auth_token: string;
	public static pad_hub: PadHub;
	public static has_focus: boolean = true;

	// Notification count
	public static notification_count: number = 0;
	public static notification_sound: HTMLAudioElement = new Audio("/Content/snd/update.mp3");

	// Page stack!
	public pages: Page[] = new Array<Page>();

	/* Static Methods */
	public static set_auth_token(token: string) {
		// Save cookie
		set_auth_cookie(token);
		Application.auth_token = token;
		Application.pad_hub = new PadHub(); // Connect to SignalR Hub
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
		delete_auth_cookie();
		Application.auth_token = null;
		Application.pad_hub.disconnect();
		Application.pad_hub = null;
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
		hash = ((hash << 5) - hash) + char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function get_auth_cookie() {
	var results = document.cookie.match('(^|;) ?' + "auth_token" + '=([^;]*)(;|$)');

	if (results)
		return ((results[2]));
	else
		return null;
}

function set_auth_cookie(auth_token: string): void {
	var cookie_string = "auth_token" + "=" + auth_token;
	var actualDate = new Date(); // convert to actual date
	var newDate = new Date(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate() + 7); // create new increased date
	cookie_string += "; expires=" + (<any>newDate).toGMTString();
	document.cookie = cookie_string;
}

function delete_auth_cookie() {
	var cookie_date = new Date();  // current date & time
	cookie_date.setTime(cookie_date.getTime() - 1);
	document.cookie = "auth_token" + "=; expires=" + (<any>cookie_date).toGMTString();
}

window.onload = function () {
	var a: Application = new Application();

	// Check to see if we have an auth token saved as a cookie.
	var saved_token = get_auth_cookie();
	if (saved_token == null) {
		// If not, show log in page.
		a.navigateTo(new LogIn());
	} else {
		// Make sure this token is still valid.
		Application.auth_token = saved_token;
		Progress.show();
		API.pads((data) => {
			// On successful API call, show the hub.
			Progress.hide();
			// Call set auth token method to ensure SignalR connection.
			Application.set_auth_token(saved_token); 
			a.clearPages();
			a.navigateTo(new Hub());
		}, () => {
			// Otherwise, clear the auth token and present log in.
			Progress.hide();
			Application.auth_token = null;
			a.navigateTo(new LogIn());
		});
	}
};