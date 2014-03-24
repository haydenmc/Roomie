class MeDialog extends Dialog {
	constructor() {
		super("me");
		var content = '<img src="" />';
		this.setContent(content);
		this.addAction("log out", () => { this.logout(); });
		this.addAction("close", () => { this.hide(); });
	}

	public logout(): void {
		Application.instance.logOut();
		this.hide();
	}
} 