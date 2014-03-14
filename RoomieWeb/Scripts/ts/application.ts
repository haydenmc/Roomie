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
		if (this.pages[this.pages.length - 1].title.length > 0) {
			document.title = notification + "roomie / " + this.pages[this.pages.length - 1].title;
		} else {
			document.title = notification + "roomie";
		}
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

window.onload = function () {
	(new Application()).navigateTo(new LogIn());
};