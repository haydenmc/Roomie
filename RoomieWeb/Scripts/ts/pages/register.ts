class Register extends Page {
	constructor() {
		super("Register");

		// Generate Registration form
		var form = document.createElement("div");
		form.id = "Register";
		form.innerHTML = '<form class="register"><input type="email" name="email" placeholder="e-mail address" /><br /><input type="text" name="displayname" placeholder="display name" /><br /><input type="password" name="password" placeholder="password" /><br /><input type="password" name="confirmpassword" placeholder="confirm password" /><input type="submit" value="register" /></form>';

		// Insert into page.
		this.page_element.insertBefore(form, null);
	}
} 