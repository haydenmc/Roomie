class Hub extends Page {

	private lastPadLoadTime: number = 0;

	constructor() {
		super("Roomie");

		// Add Me Tile
		var mediv = document.createElement("div");
		mediv.id = "MeTile";
		mediv.innerHTML = '<div class="dimmer"></div><a href="#" class="meText">Me</a>';
		mediv.getElementsByTagName("a")[0].addEventListener("click", (evt) => {
			var d: MeDialog = new MeDialog();
			d.show();
		});
		this.page_element.appendChild(mediv);

		// Add Pads List
		var padlist = document.createElement("div");
		padlist.id = "PadsList";
		padlist.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Pads</h1>';
		this.page_element.appendChild(padlist);

		// Add News List
		var newslist = document.createElement("div");
		newslist.id = "NewsList";
		newslist.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>News</h1>';
		this.page_element.appendChild(newslist);
		

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#PadsList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#NewsList", "anim_shovein_left"));
		this.show_animations.push(new Animation("#MeTile", "anim_fadein"));
		// Hide
		this.hide_animations.push(new Animation("#PadsList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#NewsList", "anim_shoveout_right"));
		this.hide_animations.push(new Animation("#MeTile", "anim_fadeout"));

		//setTimeout(() => {
		//	this.loadPads();
		//}, 100);
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
		var list = padsColumn.getElementsByTagName("ul")[0];
		var existing = list.getElementsByClassName("invite");
		var addItem = list.getElementsByClassName("add")[0];

		for (var i = 0; i < existing.length; i++) {
			//for (var j = 0; j < data.length; j++) {

			//}
			existing[i].parentNode.removeChild(existing[i]);
		}

		for (var i = 0; i < data.length; i++) {
			var inviteitem = document.createElement("li");
			inviteitem.classList.add("invite");
			inviteitem.attributes["data-invite-id"] = data[i].inviteId;
			inviteitem.innerHTML = '<img src="" /><div class="desc">' +
			'<div class="title">' + data[i].pad.streetAddress + '&nbsp;<span class="invtext">(invite)</span></div>'+
			'<div class="actions"><button>accept</button>&nbsp;/&nbsp;<button>decline</button></div>'+
			'</div>';


			(function (el:HTMLElement, invite, hub: Hub) {
				el.addEventListener("click", function () {
					Progress.show();
					API.acceptInvite(invite.inviteId, function () {
						Progress.hide();
						el.classList.add("animation");
						el.classList.add("anim_shoveout_right");
						setTimeout(function () {
							el.parentNode.removeChild(el);
						}, 300);
						hub.loadPads();
						Application.pad_hub.refreshGroups();
					}, function () {
						Progress.hide();
						alert("Error accepting invite.");
					});
				});
			})(inviteitem.getElementsByTagName("button")[0], data[i], this);

			(function (el: HTMLElement, invite, hub: Hub) {
				el.addEventListener("click", function () {
					Progress.show();
					API.declineInvite(invite.inviteId, function () {
						Progress.hide();
						el.classList.add("animation");
						el.classList.add("anim_shoveout_right");
						setTimeout(function () {
							el.parentNode.removeChild(el);
						}, 300);
						Application.pad_hub.refreshGroups();
						hub.loadPads();
					}, function () {
						Progress.hide();
						alert("Error declining invite.");
					});
				});
			})(inviteitem.getElementsByTagName("button")[1], data[i], this);

			list.insertBefore(inviteitem, addItem);
		}
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