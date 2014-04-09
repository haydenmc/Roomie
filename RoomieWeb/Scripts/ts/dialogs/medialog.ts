class MeDialog extends Dialog {
	constructor() {
		super("me");
		this.page_element.id = "MeDialog";
		var content = '<div class="usericon"><img class="usericon" style="border-left-color: ' + guidToColor(Application.instance.authentication.get_mate_id()) + ';" src="" /><input name="displayname" class="displayname" value="' + htmlEscape(Application.instance.authentication.get_display_name()) + '" /></div>';
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