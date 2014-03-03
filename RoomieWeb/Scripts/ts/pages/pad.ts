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
		chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1><div class="chatlist"></div><form class="messageEntry"><input type="text" name="body" placeholder="type your message" /><input type="submit" value="Send" /></form>';
		this.page_element.appendChild(chatPane);

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));
		// Hide
		this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));

		this.loadMates();
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
} 