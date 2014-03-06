class InviteDialog extends Dialog {
	padId: string;
	submitting: boolean = false;

	constructor(pad_id: string) {
		super("invite");
		this.padId = pad_id;
		var content = <HTMLElement>(this.page_element.getElementsByClassName("content")[0]);
		content.innerHTML = '<form><p>Type the e-mail address of the room mate you\'d like to add.<br />' +
		'If they already have an account, they will receive an invite to your pad.<br />' +
		'Otherwise, they will be sent an e-mail with instructions on how to join.</p>'+
		'<input type="email" placeholder="room mate e-mail" name="email" />';

		this.page_element.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.invite();
		});

		this.addAction("invite", () => { this.invite(); });
		this.addAction("cancel", () => { this.hide(); });
	}

	public invite() {
		if (this.submitting) {
			return;
		}
		this.submitting = true;
		Progress.show();
		var email = this.page_element.getElementsByTagName("input")[0].value;
		API.sendInvite(this.padId, email, () => { this.invite_success(); }, () => { this.invite_failure(); });
		// Disable text entry
		this.page_element.getElementsByTagName("input")[0].disabled = true;
	}

	public invite_success() {
		this.submitting = false;
		Progress.hide();
		var d = new Dialog("invite sent");
		d.setContent("<p>Your invite has been sent successfully!</p>");
		d.addAction("close", function () { (function (dialog) { dialog.hide(); })(d); });
		d.show();
		this.hide();
	}

	public invite_failure() {
		this.submitting = false;
		Progress.hide();
		this.page_element.getElementsByTagName("input")[0].disabled = false;
		var d = new Dialog("oops");
		d.setContent("<p>Your invite could not be delivered.<br />Please check the address and try again.<br />The invite recipient may have already received an invite to this pad.</p>");
		d.addAction("close", function () { (function (dialog) { dialog.hide(); })(d); });
		d.show();
	}
} 