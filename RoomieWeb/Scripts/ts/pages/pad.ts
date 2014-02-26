class Pad extends Page {
	constructor(pad_id: string, pad_name: string) {
		super(pad_name);

		var mateList = document.createElement("div");
		mateList.id = "MatesList";
		mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
		this.page_element.appendChild(mateList);

		var chatPane = document.createElement("div");
		chatPane.id = "ChatPane";
		chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1>';
		this.page_element.appendChild(chatPane);

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));
		// Hide
		this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));
	}
} 