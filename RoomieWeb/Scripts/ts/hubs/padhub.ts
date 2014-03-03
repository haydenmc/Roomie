interface SignalR {
	padHub: any;
}

class PadHub {
	private hub = $.connection.padHub;
	public ready: boolean = false;
	private messageReceivedFunction: Function;

	constructor() {
		this.hub.client.messageReceived = (userid, padid, body, time) => { this.messageReceived(userid, padid, body, time); };
		this.hub.client.systemMessage = (body) => { this.systemMessage(body); };
		$.connection.hub.start().done(() => {
			this.ready = true;
		});
	}

	public assignMessageReceived(f: Function) {
		this.messageReceivedFunction = f;
	}

	/* Client-side methods*/
	public messageReceived(userid, padid, body, time) {
		if (this.messageReceivedFunction) {
			this.messageReceivedFunction(userid, padid, body, time);
		} else {
			console.log("Message @ " + time + " from '" + userid + "': " + body);
		}
	}

	public systemMessage(body) {
		console.log("SYSTEM: " + body);
	}

	/* Server-side methods */
	public sendMessage(padid,body) {
		this.hub.server.sendMessage(padid, body);
	}
}