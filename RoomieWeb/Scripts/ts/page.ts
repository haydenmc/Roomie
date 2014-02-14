class Page {
	title: string = "";
	page_element: HTMLElement;

	constructor(t?: string) {
		if (t) {
			this.title = t;
		}
		this.page_element = document.createElement("div");
		this.page_element.classList.add("page");
		if (Application.instance.canGoBack()) {
			var backButtonElement = document.createElement("a");
			backButtonElement.classList.add("back");
			backButtonElement.addEventListener("click", () => { Application.instance.navigateBack(); });
			this.page_element.appendChild(titleElement);
		}
		if (this.title.length > 0)
		{
			var titleElement = document.createElement("h1");
			titleElement.classList.add("title");
			titleElement.innerHTML = this.title;
			this.page_element.appendChild(titleElement);
		}
		
	}
	show(): void {
		this.page_element = <HTMLElement>(document.body.insertBefore(this.page_element));
	}
	hide(): void {
		this.page_element = <HTMLElement>(this.page_element.parentNode.removeChild(this.page_element));
	}
} 