class Application {
	// Running instance reference
	public static instance: Application;
	public static auth_token: string;

	// Page stack!
	public pages: Page[] = new Array<Page>();

	constructor() {
		Application.instance = this;
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
	}

	/**
	 * navigateBack
	 * Navigate back to the previous page, removing current page from page stack.
	 */
	public navigateBack(): void {
		if (this.pages.length > 1) {
			this.pages.pop().hide();
			this.pages[this.pages.length - 1].show();
		}
	}
}

window.onload = function () {
	(new Application()).navigateTo(new LogIn());
}