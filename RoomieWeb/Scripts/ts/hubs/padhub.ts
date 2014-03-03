interface SignalR {
	padHub: any;
}

class PadHub {
	private hub = $.connection.padHub;
	public ready: boolean = false;

	constructor() {
		this.hub.client.messageReceived = (userid, padid, body) => { this.messageReceived(userid, padid, body); };
		this.hub.client.systemMessage = (body) => { this.systemMessage(body); };
		$.connection.hub.start().done(() => {
			//this.hub.server.joinPads(Application.auth_token); // Should happen automagically.
			this.ready = true;
		});
	}

	/* Client-side methods*/
	public messageReceived(userid,padid,body) {
		console.log("Message from '" + userid + "': " + body);
	}

	public systemMessage(body) {
		console.log("SYSTEM: " + body);
	}

	/* Server-side methods */
	public sendMessage(padid,body) {
		this.hub.server.sendMessage(padid, body);
	}
}