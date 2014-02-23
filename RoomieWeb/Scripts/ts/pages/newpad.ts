class NewPad extends Page {
	constructor() {
		super("New Pad");


		var form = document.createElement("form");
		form.id = "NewPad";
		var formhtml = '<input name = "StreetAddress" placeholder = "Street Address">'
		formhtml += '<br /><input name="ZipCode" placeholder = "Zip Code">';
		formhtml += '<br /><input type="submit" value="Create">';
		form.innerHTML = formhtml;
		this.page_element.appendChild(form);
		
		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#NewPad", "anim_shovein_bottom"));
		// Hide
		this.hide_animations.push(new Animation("#NewPad", "anim_shoveout_bottom"));
	}
} 