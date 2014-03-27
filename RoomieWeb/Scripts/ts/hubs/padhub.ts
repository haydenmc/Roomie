interface SignalR {
	padHub: any;
}

class PadHub {
	private hub = $.connection.padHub;
	public ready: boolean = false;
	private disconnecting: boolean = false;
	private currentPadPage: Pad;

	constructor() {
		this.hub.client.messageReceived = (userid, padid, body, time) => { this.messageReceived(userid, padid, body, time); };
		this.hub.client.mateJoined = (padid, mate) => { this.mateJoined(padid, mate); };
		this.hub.client.systemMessage = (body) => { this.systemMessage(body); };
		this.hub.client.inviteReceived = (invite) => { this.inviteReceived(invite); };
		this.hub.client.typingReceived = (padid, mate) => { this.typingReceived(padid, mate); }
		this.hub.client.mateOnline = (mate) => { this.mateOnline(mate); }
		this.hub.client.mateOffline = (mate) => { this.mateOffline(mate); }

		$.connection.hub.disconnected(() => {
			if (!this.disconnecting)
			{
				this.lostConnection();
			}
		});
	}
	public connect() {
		$.connection.hub.start().done(() => {
			this.ready = true;
		});
	}
	public disconnect() {
		this.disconnecting = true;
		$.connection.hub.stop();
		this.disconnecting = false;
	}

	public lostConnection(retry?: boolean) {
		if (retry === undefined) retry = false;
		if (!retry)
		{
			Progress.show();
		}
		console.log("Lost connection to server. Attempting reconnect...");
		setTimeout(() => {
			$.connection.hub.start().done(() => {
				this.reconnected();
			}).fail(() => {
				this.lostConnection(true);
			});
		}, 5000); // Restart connection after 5 seconds.
	}

	public reconnected() {
		console.log("Reconnected successfully.");
		Progress.hide();
		if (this.currentPadPage) {
			this.currentPadPage.reconnected();
		}
	}

	public setPadPage(page: Pad) {
		this.currentPadPage = page;
	}

	public clearPadPage(page: Pad) {
		if (this.currentPadPage === page) {
			this.currentPadPage = null;
		}
	}

	/* Client-side methods*/
	public messageReceived(userid, padid, body, time) {
		if (this.currentPadPage) {
			this.currentPadPage.messageReceived(userid, padid, body, time);
		} else {
			console.log("Message @ " + time + " from '" + userid + "': " + body);
		}
	}

	public typingReceived(padid: string, mate: any) {
		if (this.currentPadPage) {
			this.currentPadPage.mateTyping(padid, mate);
		} else {
			console.log("Typing from '" + mate.mateId + "'");
		}
	}

	public mateJoined(padid: string, mate: any) {
		console.log("MATE JOINED");
		if (this.currentPadPage) {
			this.currentPadPage.mateJoined(padid, mate);
		} else {
			console.log(mate.displayName + " joined one of your pads.");
		}
	}
	public mateOnline(mate: any) {
		console.log("MATE ONLINE");
		if (this.currentPadPage) {
			this.currentPadPage.mateOnline(mate);
		}
	}
	public mateOffline(mate: any) {
		console.log("MATE OFFLINE");
		if (this.currentPadPage) {
			this.currentPadPage.mateOffine(mate);
		}
	}

	public inviteReceived(invite: any) {
		console.log("RECEIVED INVITE: ");
		console.dir(invite);
		// If we're on the hub page, reload them invites.
		if (Application.instance.pages[Application.instance.pages.length - 1] instanceof Hub) {
			(<Hub>Application.instance.pages[Application.instance.pages.length - 1]).loadInvites();
		}
	}

	public systemMessage(body) {
		console.log("SYSTEM: " + body);
	}

	/* Server-side methods */
	public sendMessage(padid,body) {
		this.hub.server.sendMessage(padid, body).fail(function () { alert("FAILURE sending message to server"); });
	}

	public typing(padid) {
		this.hub.server.typing(padid);
	}

	public refreshGroups() {
		this.hub.server.refreshGroups();
	}
}