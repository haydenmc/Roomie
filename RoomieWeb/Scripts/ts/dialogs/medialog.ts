class MeDialog extends Dialog {
	constructor() {
		super("me");

		this.addAction("log out", () => { this.logout(); });
		this.addAction("close", () => { this.hide(); });
	}

	public logout(): void {
		Application.instance.logOut();
		this.hide();
	}
} 