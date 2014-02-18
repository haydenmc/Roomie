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

window.onload = function () {
	(new Application()).navigateTo(new LogIn());
}