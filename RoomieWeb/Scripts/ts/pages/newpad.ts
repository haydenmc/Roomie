class NewPad extends Page {
	constructor() {
		super("New Pad");

		var form = document.createElement("form");
		form.id = "NewPad";
		var formhtml = '<input name = "StreetAddress" placeholder = "Street Address">';
		formhtml += '<br /><input name="ZipCode" placeholder = "Zip Code">';
		formhtml += '<br /><input type="submit" value="Create">';
		form.innerHTML = formhtml;
		form.addEventListener("submit", (evt) => {
			var inputs = this.page_element.getElementsByTagName("input");
			// If one of the inputs is already disabled, we're already submitting.
			if (inputs[0].disabled) {
				return;
			}
			// Disable all inputs
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].disabled = true;
			}
			evt.preventDefault();
			// Show the progress bar
			Progress.show();
			// Call the API
			API.newpad(inputs[0].value, inputs[1].value, (data) => {
				// On success ...
				Progress.hide();
				if (Application.instance.pages[Application.instance.pages.length - 2] instanceof Hub) {
					(<Hub>(Application.instance.pages[Application.instance.pages.length - 2])).resetPadLoadTime(); // Reload pads
				}
				Application.instance.navigateBack();
			}, () => {
				// On error ...
				// TODO: Better error handling.
				Progress.hide();
				alert("ERROR CREATING PAD");
				Application.instance.navigateBack();
			});
		});
		this.page_element.appendChild(form);
		
		// Prepare animations
		// Show
		this.show_animations.push(new Animation("#NewPad", "anim_shovein_bottom"));
		// Hide
		this.hide_animations.push(new Animation("#NewPad", "anim_shoveout_bottom"));
	}
} 