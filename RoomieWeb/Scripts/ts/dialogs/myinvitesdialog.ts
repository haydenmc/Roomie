class MyInvitesDialog extends Dialog {
	constructor() {
		super("invites");
		var content = '<p>Any invites you receive to join new pads will show up here.<br />' +
			'Accept invites to join the pad. Decline to remove the invite.</p>' +
		'<ul class="invitelist"></ul>';
		this.setContent(content);
		this.addAction("close", () => { this.hide(); });
		Progress.show();
		// Load invites...
		API.invites((data) => { this.loadinvites_success(data); }, () => { });
	}

	public loadinvites_success(data) {
		Progress.hide();
		var listElement = <HTMLElement>(this.page_element.getElementsByClassName("invitelist")[0]);
		//var content = '';
		for (var i = 0; i < data.length; i++) {
			var inviteitem = document.createElement("li");
			inviteitem.innerHTML = '<div class="info"><span class="name">' + data[i].pad.streetAddress + '</span><br />invited by ' + data[i].sender.displayName + '</div><div class="actions"><button>accept</button><button>decline</button></div>';
			var id = data[i].inviteId;
			(function (inviteId, element) {
				element.getElementsByTagName("button")[0].addEventListener("click", function () {
					Progress.show();
					API.acceptInvite(inviteId, function () {
						Progress.hide();
						element.classList.add("animation");
						element.classList.add("anim_shoveout_right");
						// Reload pad listings if we're on the hub.
						if (Application.instance.pages[Application.instance.pages.length - 1] instanceof Hub) {
							(<Hub>(Application.instance.pages[Application.instance.pages.length - 1])).resetPadLoadTime(); // Reload pads
							(<Hub>(Application.instance.pages[Application.instance.pages.length - 1])).loadPads();
						}
						setTimeout(function () {
							element.parentNode.removeChild(element);
						}, 500);
					}, function () {
							Progress.hide();
							var d = new Dialog("error");
							d.setContent("<p>We had some trouble accepting this invite.<br />Perhaps you've already accepted it.<br />Try to accept it again later.");
							d.addAction("close", function () { (function (dialog) { dialog.hide(); })(d); });
							d.show();
						});
				});
			})(id, inviteitem);
			
			listElement.appendChild(inviteitem);
		}
		//listElement.innerHTML = content;
	}
} 