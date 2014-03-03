class Pad extends Page {
	pad_id: string;
	constructor(pad_id: string, pad_name: string) {
		super(pad_name);
		this.pad_id = pad_id;
		var mateList = document.createElement("div");
		mateList.id = "MatesList";
		mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
		this.page_element.appendChild(mateList);

		var chatPane = document.createElement("div");
		chatPane.id = "ChatPane";
		chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1><ul class="chatlist"><li><div class="body">This is a test message.</div><div class="information"><div class="name">Hayden McAfee</div><div class="time">16:30</div></div></li></ul><form class="messageEntry"><input type="text" name="body" placeholder="type your message" /><input type="submit" value="Send" /></form>';
		this.page_element.appendChild(chatPane);

		// Set up event handlers ...
		chatPane.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.sendMessage();
		});

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));
		// Hide
		this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));

		this.loadMates();
	}

	public sendMessage() {
		var input = this.page_element.getElementsByTagName("input")[0];
		Application.pad_hub.sendMessage(this.pad_id, input.value);
		input.value = '';
	}

	public loadMates(): void {
		API.padmates(this.pad_id, (d) => { this.loadMates_success(d); }, () => {/*TODO: Handle error*/});
	}

	//TODO: Make this update the existing list instead of replacing it entirely...
	public loadMates_success(mates: any): void {
		var matesColumn = document.getElementById("MatesList");

		// Check and remove existing pad lists.
		var existingLists = matesColumn.getElementsByTagName("ul");
		if (existingLists.length > 0) {
			existingLists[0].parentNode.removeChild(existingLists[0]);
		}

		var mateList = document.createElement("ul");

		for (var i = 0; i < mates.length; i++) {
			var mateListing = document.createElement("li");
			mateListing.innerHTML = '<img src="" /><div class="name">'
			+ mates[i].displayName.split(/\b/)[0]; 
			+ '</div>';
			mateListing.classList.add("mate");
			mateList.insertBefore(mateListing, null);
		}

		matesColumn.insertBefore(mateList, null);
	}

	public messageReceived(user_id: string, pad_id: string, body: string, time: string) {
		if (pad_id != this.pad_id) return; // Don't do anything if this message isn't for this pad.
		var cleanBody = htmlEscape(body);
		var msgElement = document.createElement("li");
		msgElement.classList.add("animation");
		msgElement.classList.add("anim_shovein_bottom");
		msgElement.innerHTML = '<div class="body">' + cleanBody + '</div>' +
		'<div class="information">' +
		'<div class="name">' + user_id + '</div>' +
		'<div class="time">' + time + '</div>' +
		'</div>' +
		'</div>';

		document.getElementById("ChatPane").getElementsByTagName("ul")[0].appendChild(msgElement);
	}

	public show(): void {
		super.show();

		Application.pad_hub.assignMessageReceived((user_id, pad_id, body, time) => {
			this.messageReceived(user_id, pad_id, body, time);
		});
	}
} 