class Register implements Page {
	public name: string = "Register";
	public page_element: HTMLElement;
	constructor() {
		this.page_element = document.createElement("div");
		this.page_element.classList.add("page");
		this.page_element.innerHTML = '<h1 class="title">register</h1>';
	}
	public show(): void {
		this.page_element = <HTMLElement>(document.getElementsByTagName("body")[0].insertBefore(this.page_element));
	}

	public hide(): void {
		this.page_element = <HTMLElement>(this.page_element.parentNode.removeChild(this.page_element));
	}

	public destroy(): void {

	}
} 