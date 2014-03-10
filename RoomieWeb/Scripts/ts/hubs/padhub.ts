interface SignalR {
	padHub: any;
}

class PadHub {
	private hub = $.connection.padHub;
	public ready: boolean = false;
	private currentPadPage: Pad;

	constructor() {
		this.hub.client.messageReceived = (userid, padid, body, time) => { this.messageReceived(userid, padid, body, time); };
		this.hub.client.mateJoined = (padid, mate) => { this.mateJoined(padid, mate); };
		this.hub.client.systemMessage = (body) => { this.systemMessage(body); };
		$.connection.hub.start().done(() => {
			this.ready = true;
		});
	}

	public setPadPage(page: Pad) {
		this.currentPadPage = page;
	}

	public clearPadPage(page: Pad) {
		if (this.currentPadPage == page) {
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

	public mateJoined(padid: string, mate: any) {
		console.log("MATE JOINED");
		if (this.currentPadPage) {
			this.currentPadPage.mateJoined(padid, mate);
		} else {
			console.log(mate.displayName + " joined one of your pads.");
		}
	}

	public systemMessage(body) {
		console.log("SYSTEM: " + body);
	}

	/* Server-side methods */
	public sendMessage(padid,body) {
		this.hub.server.sendMessage(padid, body).fail(function () { alert("FAILURE sending message to server"); });
	}

	public refreshGroups() {
		this.hub.server.refreshGroups();
	}
}