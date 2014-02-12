class LogIn implements Page {
	public name: string = "Log In";
	public page_element: HTMLElement;
	public form_element: HTMLElement;

	constructor() {
		this.form_element = document.createElement("div");
		this.form_element.id = "LogIn";
		this.form_element.innerHTML = "<h1>roomie</h1><div class=\"separator\"></div><form><input name=\"email\" placeholder=\"e-mail address\" /><br /><input name=\"password\" type=\"password\" placeholder=\"password\" /><br /><div style=\"text-align:center;\"><a class=\"register\" href=\"#\">register</a></div></form>";

		this.page_element = document.createElement("div");
		this.page_element.classList.add("page");
		this.form_element = <HTMLElement>(this.page_element.insertBefore(this.form_element));
	}

	public show(): void {
		this.page_element = <HTMLElement>(document.getElementsByTagName("body")[0].insertBefore(this.page_element));
	}

	public hide(): void {

	}
} 