class Register extends Page {
	constructor() {
		super("Register");

		// Generate Registration form
		var form = document.createElement("div");
		form.id = "Register";
		form.innerHTML = '<form class="register"><input type="email" name="Email" placeholder="e-mail address" /><br /><input type="text" name="DisplayName" placeholder="display name" /><br /><input type="password" name="Password" placeholder="password" /><br /><input type="password" name="ConfirmPassword" placeholder="confirm password" /><input type="submit" value="register" /></form>';

		form.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.submit();
		});

		// Insert into page.
		this.page_element.insertBefore(form, null);
	}

	/**
	 * submit
	 * Called when submitting the registration form.
	 */
	public submit(): void {
		// Get the inputs
		var inputs = this.page_element.getElementsByTagName("input");

		// If the input is already disabled, we're probably trying to register already.
		if (inputs[0].disabled == true)
			return;

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
		$.ajax("/api/Account/Register", {
			type: "POST",
			data: { Email: email, DisplayName: displayname, Password: password, ConfirmPassword: confirmpassword },
			success: () => {
				Progress.hide(); // Hide the progress bar.
				// Navigate to hub.
				Application.instance.clearPages();
				Application.instance.navigateTo(new Hub());
			},
			error: () => {
				Progress.hide(); // Hide the progress bar.
				alert("failure.");
				inputs[0].disabled = false;
				inputs[1].disabled = false;
				inputs[2].disabled = false;
				inputs[3].disabled = false;
			}
		})
	}
} 