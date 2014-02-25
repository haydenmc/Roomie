class Register extends Page {
	constructor() {
		super("Register");

		// Generate Registration form
		var form = document.createElement("div");
		form.id = "Register";
		form.innerHTML = '<form class="register">\
			<input type="email" name="Email" placeholder="e-mail address" /><br />\
			<input type="text" name="DisplayName" placeholder="display name" /><br />\
			<input type="password" name="Password" placeholder="password" /><br />\
			<input type="password" name="ConfirmPassword" placeholder="confirm password" />\
			<input type="submit" value="register" />\
			</form>';

		form.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.submit();
		});

		// Insert into page.
		this.page_element.insertBefore(form, null);

		// Prepare animations
		// Show
		this.show_animations.push(new Animation("form.register", "anim_shovein_bottom"));
		// Hide
		this.hide_animations.push(new Animation("form.register", "anim_shoveout_bottom"));
	}

	/**
	 * submit
	 * Called when submitting the registration form.
	 */
	public submit(): void {
		// Get the inputs
		var inputs = this.page_element.getElementsByTagName("input");

		// If the input is already disabled, we're probably trying to register already.
		if (inputs[0].disabled === true) {
			return;
		}

		// Show progress indicator
		Progress.show();

		// Disable input boxes
		inputs[0].disabled = true;
		inputs[1].disabled = true;
		inputs[2].disabled = true;
		inputs[3].disabled = true;

		// Fetch input values
		var email = inputs[0].value;
		var displayname = inputs[1].value;
		var password = inputs[2].value;
		var confirmpassword = inputs[3].value;

		// Call API
		API.register(email, displayname, password, confirmpassword, (data) => {
			// Fetch authentication token
			API.token(email, password, (data) => {
				// Hide the progress bar
				Progress.hide();
				// Get our auth token
				Application.auth_token = data.access_token;
				// Navigate to hub!
				Application.instance.clearPages();
				Application.instance.navigateTo(new Hub());
			}, () => {
				Progress.hide(); // Hide the progress bar.
				alert("Error logging in.");
				var inputs = this.page_element.getElementsByTagName("input");
				inputs[0].disabled = false;
				inputs[1].disabled = false;
				inputs[2].disabled = false;
				inputs[3].disabled = false;
			});
		}, () => {
			Progress.hide(); // Hide the progress bar.
			alert("failure.");
			var inputs = this.page_element.getElementsByTagName("input");
			inputs[0].disabled = false;
			inputs[1].disabled = false;
			inputs[2].disabled = false;
			inputs[3].disabled = false;
		});
	}
} 