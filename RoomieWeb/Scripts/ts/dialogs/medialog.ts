class MeDialog extends Dialog {
	constructor() {
		super("me");
		this.page_element.id = "MeDialog";
		var content = '<div class="usericon"><img class="usericon" style="border-left-color: ' + guidToColor(Application.identity_id) + ';" src="" /><input name="displayname" class="displayname" value="' + htmlEscape(Application.identity_displayname) + '" /></div>';
		this.setContent(content);
		this.addAction("save", () => { this.save(); });
		this.addAction("log out", () => { this.logout(); });
		this.addAction("close", () => { this.hide(); });
	}
	public save(): void {
		alert("NOT IMPLEMENTED");
	}
	public logout(): void {
		Application.instance.logOut();
		this.hide();
	}
} 