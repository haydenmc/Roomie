class LogIn implements Page {
	public name: string = "Log In";
	public form_element: HTMLElement;

	constructor() {
		this.form_element = document.createElement("div");
		this.form_element.id = "LogIn";
		this.form_element.innerHTML = "<h1>roomie</h1><div class=\"separator\"></div><form><input name=\"email\" placeholder=\"e-mail address\" /><br /><input name=\"password\" type=\"password\" placeholder=\"password\" /><br /><div style=\"text-align:center;\"><a class=\"register\" href=\"#\">register</a></div></form>";
	}

	public show(): void {
		this.form_element = <HTMLElement>(document.getElementsByTagName("body")[0].insertBefore(this.form_element));
	}

	public hide(): void {

	}
} 