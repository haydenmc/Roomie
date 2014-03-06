class Hub extends Page {

	private lastPadLoadTime: number = 0;

	constructor() {
		super("Roomie");
		// Add Me Tile
		this.page_element.innerHTML += '<div id="MeTile"><div class="dimmer"></div><a href="#" class="meText">Me</a></div>';
		// Add Pads List
		this.page_element.innerHTML += '<div id="PadsList"><h1 class="listTitle"><div class="gradient"></div>Pads</h1></div>';
		// Add News List
		this.page_element.innerHTML += '<div id="NewsList"><h1 class="listTitle"><div class="gradient"></div>News</h1></div>';
		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#PadsList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#NewsList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#MeTile", "anim_fadein"));
		// Hide
		this.hide_animations.push(new Animation("#PadsList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#NewsList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#MeTile", "anim_fadeout"));

		setTimeout(() => {
			this.loadPads();
		}, 100);
	}

	public show(): void {
		super.show();
		if ((new Date()).getTime() - this.lastPadLoadTime > 10000) {
			this.loadPads();
		}
	}

	public resetPadLoadTime() {
		this.lastPadLoadTime = 0;
	}

	public loadInvites() {
		API.invites((data) => { this.loadInvites_success(data); }, () => { } );
	}

	public loadInvites_success(data) {
		var padsColumn = document.getElementById("PadsList");
		if (data.length <= 0) {
			return;
		}
		if (padsColumn.getElementsByClassName("invites").length > 0) {
			return; //Don't show multiple multiple notifications
		}
		var inviteDiv = document.createElement("div");
		inviteDiv.classList.add("invites");
		inviteDiv.innerHTML = '<a href="#" class="inviteButton"></a>New Invites';
		inviteDiv.addEventListener("click", () => {
			(new MyInvitesDialog()).show();
		});
		padsColumn.insertBefore(inviteDiv, padsColumn.getElementsByTagName("ul")[0]);
	}

	public loadPads() {
		this.lastPadLoadTime = (new Date()).getTime();

		//If we get rid of (fix/replace) this line, we could load pads when page isn't even shown.
		var padsColumn = document.getElementById("PadsList");

		// Check and remove existing pad lists.
		var existingLists = padsColumn.getElementsByTagName("ul");
		if (existingLists.length > 0) {
			existingLists[0].parentNode.removeChild(existingLists[0]);
		}

		var padList = document.createElement("ul");

		var loadingPad = document.createElement("li");
		loadingPad.innerHTML = '<div class="meter"></div><div class="desc">Loading ...</div>';
		loadingPad.classList.add("loading");
		padList.insertBefore(loadingPad, null);

		var addPad = document.createElement("li");
		addPad.innerHTML = '<a href="#"></a><div class="desc">New Pad</div>';
		addPad.classList.add("add");
		addPad.addEventListener("click", () => {
			Application.instance.navigateTo(new NewPad());
		});
		padList.insertBefore(addPad, null);

		padsColumn.insertBefore(padList, null);

		API.pads((data) => {
			this.loadPads_success(data);
		}, () => {
				//Todo: Error reporting
		});
	}

	//TODO: Make this update the existing list instead of replacing it entirely...
	public loadPads_success(pads) {
		var padsColumn = document.getElementById("PadsList");

		// Check and remove existing pad lists.
		var existingLists = padsColumn.getElementsByTagName("ul");
		if (existingLists.length > 0) {
			existingLists[0].parentNode.removeChild(existingLists[0]);
		}

		var padList = document.createElement("ul");

		for (var i = 0; i < pads.length; i++) {
			var padListing = document.createElement("li");
			padListing.innerHTML =	'<img src="" /><div class="desc"><span class="address">'
				+ pads[i].streetAddress
				+ '</span><br /><span class="stats">more data here</span></div>';
			padListing.classList.add("pad");
			var padId = pads[i].padId;
			var streetAddress = pads[i].streetAddress;
			(function (p, s) {
				padListing.addEventListener("click", function (e) {
					Application.instance.navigateTo(new Pad(p, s));
				});
			})(padId, streetAddress);
			padList.insertBefore(padListing, null);
		}
		
		var addPad = document.createElement("li");
		addPad.innerHTML = '<a href="#"></a><div class="desc">New Pad</div>';
		addPad.classList.add("add");
		addPad.addEventListener("click", () => {
			Application.instance.navigateTo(new NewPad());
		});
		padList.insertBefore(addPad, null);

		padsColumn.insertBefore(padList, null);

		// Check for new pad invites... if we haven't already got the notification
		this.loadInvites();
	}
}