class Mate {
	mateId: string;
	displayName: string;
	joinTime: Date;
}

class Pad extends Page {
	pad_id: string;
	mates: Array<Mate>;
	typingTimeouts: any = {}; // Hash map for storing typing timeouts
	lastTypingTime: number = 0;
	constructor(pad_id: string, pad_name: string) {
		super(pad_name);
		this.pad_id = pad_id;
		var mateList = document.createElement("div");
		mateList.id = "MatesList";
		mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
		this.page_element.appendChild(mateList);

		var chatPane = document.createElement("div");
		chatPane.id = "ChatPane";
		chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1>' +
		'<ul class="chatlist" ></ul>' +
		'<form class="messageEntry" >' +
		'<input type="text" name="body" placeholder ="type your message" autocomplete="off" autocorrect="on" autocapitalize="on" />' +
		'<input type="submit" value="Send" /></form>';
		this.page_element.appendChild(chatPane);

		// Set up event handlers ...
		chatPane.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.sendMessage();
		});
		chatPane.getElementsByTagName("input")[0].addEventListener("keypress", (evt) => {
			this.typing();
		});

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));
		// Hide
		this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));

		// Load mates, and load history AFTER mates (we need mate list to associate IDs with names)
		this.loadMates(() => { this.loadHistory(); });
		
	}

	public sendMessage() {
		var input = this.page_element.getElementsByTagName("input")[0];
		Application.pad_hub.sendMessage(this.pad_id, input.value);
		input.value = '';
		// Scroll to bottom
		var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
		messagelist.scrollTop = messagelist.scrollHeight;
		input.focus();

	}

	public typing() {
		if ((new Date()).getTime() - this.lastTypingTime > 1000) {
			console.log("I'm typing...");
			this.lastTypingTime = (new Date()).getTime();
			Application.pad_hub.typing(this.pad_id);
		}
	}

	public loadMates(f?:Function): void {
		API.padmates(this.pad_id, (d) => { this.loadMates_success(d); if (f) { f(); } }, () => {/*TODO: Handle error*/});
	}

	//TODO: Make this update the existing list instead of replacing it entirely...
	public loadMates_success(mates: any): void {
		this.mates = mates;
		var matesColumn = document.getElementById("MatesList");

		// Check and remove existing pad lists.
		var existingLists = matesColumn.getElementsByTagName("ul");
		if (existingLists.length > 0) {
			existingLists[0].parentNode.removeChild(existingLists[0]);
		}

		var mateList = document.createElement("ul");

		for (var i = 0; i < mates.length; i++) {
			var mateListing = document.createElement("li");
			if (!mates[i].isOnline) {
				mateListing.classList.add("offline");
			}
			mateListing.innerHTML = '<div class="usericon" style="border-left-color: ' + guidToColor(mates[i].mateId) + ';"><img src="" /></div><div class="name">'
			+ mates[i].displayName.split(/\b/)[0];
			+ '</div>';
			mateListing.classList.add("mate");
			mateList.insertBefore(mateListing, null);
		}

		var addListing = document.createElement("li");
		addListing.innerHTML = '<a href="#"></a><div class="desc">Invite</div>';
		addListing.classList.add("add");
		addListing.addEventListener("click", () => {
			this.showInviteDialog();
		});
		mateList.insertBefore(addListing, null);

		matesColumn.insertBefore(mateList, null);
	}

	public showInviteDialog(): void {
		var invite_dialog = new InviteDialog(this.pad_id);
		invite_dialog.show();
	}

	public loadHistory(): void {
		// TODO: Deal with failure.
		API.padmessages(this.pad_id, (d) => { this.loadHistory_success(d); }, () => { });
	}

	public loadHistory_success(data: any): void {
		var html = '';
		for (var i = 0; i < data.length; i++) {
			html += this.formatMessage(data[i].mateId, data[i].body, new Date(data[i].sendTime), true);
		}
		var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
		messagelist.innerHTML = html + messagelist.innerHTML;

		// Scroll to bottom
		messagelist.scrollTop = messagelist.scrollHeight;
	}

	/**
	 * Returns a formatted message in either HTML string or HTMLElement
	 */
	public formatMessage(mateid: string, body: string, sendtime: Date, html?: boolean): any {
		var color = guidToColor(mateid);
		body = htmlEscape(body);
		body = (<any>Autolinker).link(body, { truncate: 128, stripPrefix: true, newWindow: true, twitter: false });
		var contents = '<div class="idstrip" style="background-color: ' + color + ';"></div>' +
			'<div class="message">' +
			'<div class="body" > ' + body + ' </div > ' +
			'<div class="information">' +
			'<div class="name">' + this.guidToDisplayName(mateid) + '</div>' +
			'<div class="time">' + this.friendlyDateTime(sendtime) + '</div>' +
			'</div>' +
			'</div>' +
			'</div>';
		if (html) {
			return '<li class="animation anim_fadein">' + contents + '</li>';
		} else {
			var msgElement = document.createElement("li");
			msgElement.classList.add("animation");
			msgElement.classList.add("anim_shovein_left");
			msgElement.innerHTML = contents;
			return msgElement;
		}
	}

	public friendlyDateTime(date: Date) {
		var d = new Date(); // Current
		if (date.getDate() != d.getDate() || date.getMonth() != d.getMonth() || date.getFullYear() != d.getFullYear())
		{
			return date.toLocaleDateString() + " " + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
		}
		return date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
	}

	public guidToDisplayName(guid: string) {
		var dname = "Unknown User";
		for (var i = 0; i < this.mates.length; i++) {
			if (this.mates[i].mateId === guid) {
				dname = this.mates[i].displayName;
				break;
			}
		}
		return dname;
	}

	// SIGNALR HUB METHOD
	public messageReceived(user_id: string, pad_id: string, body: string, time: string) {
		if (pad_id !== this.pad_id) {
			return; // Don't do anything if this message isn't for this pad.
		}

		// Build the message element
		var msgElement = <HTMLElement>(this.formatMessage(user_id, body, new Date(time)));

		var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
		var style = window.getComputedStyle(messagelist, null);
		var innerheight = parseInt(style.getPropertyValue("height"));
		var scroll = (messagelist.scrollHeight - (innerheight + messagelist.scrollTop) <= 16);
		messagelist.appendChild(msgElement);
		if (scroll) {
			// Scroll to bottom
			messagelist.scrollTop = messagelist.scrollHeight;
		}

		// Notification
		Application.instance.addNotification();
	}

	// SIGNALR HUB METHOD
	public mateJoined(pad_id: string, mate: any) {
		if (pad_id !== this.pad_id) {
			return; // Don't do anything if this message isn't for this pad.
		}

		this.loadMates(); // Reload mates
	}

	// SIGNALR HUB METHOD
	public mateTyping(pad_id: string, mate: any) {
		if (pad_id !== this.pad_id) {
			return; // Don't do anything if this message isn't for this pad.
		}
		console.log("Typing from '" + mate.DisplayName + "'.");
		if (this.typingTimeouts[mate.MateId]) {
			clearTimeout(this.typingTimeouts[mate.MateId]);
		}
		var i;
		for (i = 0; i < this.mates.length; i++) {
			if (this.mates[i].mateId == mate.MateId) {
				break;
			}
		}
		var matesList = document.getElementById("MatesList").getElementsByTagName("ul")[0];
		var mateItem = (<HTMLElement>(matesList.childNodes[i]));
		if (!mateItem.classList.contains("typing")) {
			mateItem.classList.add("typing");
		}
		this.typingTimeouts[mate.MateId] = setTimeout(() => {
			mateItem.classList.remove("typing");
		}, 2000);
	}

	// SIGNALR HUB METHOD
	public mateOnline(mate: any)
	{
		var i;
		for (i = 0; i < this.mates.length; i++) {
			if (this.mates[i].mateId == mate.MateId) {
				break;
			}
		}
		var matesList = document.getElementById("MatesList").getElementsByTagName("ul")[0];
		var mateItem = (<HTMLElement>(matesList.childNodes[i]));
		if (mateItem.classList.contains("offline")) {
			mateItem.classList.remove("offline");
		}
	}

	// SIGNALR HUB METHOD
	public mateOffine(mate: any) {
		var i;
		for (i = 0; i < this.mates.length; i++) {
			if (this.mates[i].mateId == mate.MateId) {
				break;
			}
		}
		var matesList = document.getElementById("MatesList").getElementsByTagName("ul")[0];
		var mateItem = (<HTMLElement>(matesList.childNodes[i]));
		if (!mateItem.classList.contains("offline")) {
			mateItem.classList.add("offline");
		}
	}

	public show(): void {
		super.show();
		Application.pad_hub.setPadPage(this);
	}

	public hide(): void {
		super.hide();
		Application.pad_hub.clearPadPage(this);
	}
} 