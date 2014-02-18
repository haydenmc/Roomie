class LogIn extends Page {
	constructor() {
		super();
		this.page_element.innerHTML += "<div id=\"LogIn\"><h1>roomie</h1><div class=\"separator\"></div><form><input name=\"email\" placeholder=\"e-mail address\" /><br /><input name=\"password\" type=\"password\" placeholder=\"password\" /><br /><div style=\"text-align:center;\"><input type=\"submit\" value=\"log in\"/><br /><a class=\"register\" href=\"#\">register</a></div></form></div>";

		//Bind event handlers.
		this.page_element.getElementsByClassName("register")[0].addEventListener("click", () => {
			this.register();
		});
		this.page_element.getElementsByTagName("form")[0].addEventListener("submit", (evt) => {
			evt.preventDefault();
			this.authenticate();
		});
	}

	public show(): void {
		super.show();
	}

	public hide(): void {
		super.hide();
	}

	public register(): void {
		Application.instance.navigateTo(new Register());
	}

	public authenticate(): void {
		// If our inputs are disabled, we're probably already trying to authenticate.
		var input_elements = this.page_element.getElementsByTagName("input");
		if (input_elements[0].disabled)
			return;

		// Grab the username and password
		var username = input_elements[0].value;
		var password = input_elements[1].value;

		// Disable input
		input_elements[0].disabled = true;
		input_elements[1].disabled = true;

		// Show the progress bar
		Progress.show();

		// Authenticate!
		$.ajax("/Token", {
			type: "POST",
			data: { grant_type: "password", username: username, password: password },
			success: () => {
				alert("YAY");
				// Hide the progress bar
				Progress.hide();
			},
			error: () => {
				alert("Boo.");
				// Hide the progress bar
				Progress.hide();
			}
		});
	}
} 