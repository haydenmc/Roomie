class Dialog {
	title: string = "";
	page_element: HTMLElement;
	overlay_element: HTMLElement;
	actions: DialogAction[] = new Array();

	constructor(t?: string) {
		if (t) {
			this.title = t;
		}
		this.page_element = document.createElement("div");
		this.page_element.classList.add("dialog");
		
		this.page_element.innerHTML = '<h1>' + this.title + '</h1>' +
		'<div class="separator"></div>' +
		'<div class="content"></div>' +
		'<ul class="actions"></ul>';
	}

	public addAction(text: string, action: Function, def?: boolean) {
		var a = new DialogAction();
		a.text = text;
		a.action = action;
		this.actions.push(a);

		var li = document.createElement("li");
		var b = document.createElement("button");
		if (def) {
			b.classList.add("default");
		}
		b.innerText = text;
		b.addEventListener("click", (evt) => { action(); });
		li.appendChild(b);

		this.page_element.getElementsByClassName("actions")[0].appendChild(li);
	}

	public setContent(content: string) {
		var element = <HTMLElement>(this.page_element.getElementsByClassName("content")[0]);
		element.innerHTML = content;
	}

	public show(): void {
		this.overlay_element = document.createElement("div");
		this.overlay_element.classList.add("darkOverlay");
		this.overlay_element.classList.add("animation");
		this.overlay_element.classList.add("anim_fadein");
		this.overlay_element = <HTMLElement>(document.body.appendChild(this.overlay_element));

		this.page_element.classList.add("animation");
		this.page_element.classList.add("anim_shovein_bottom");
		this.page_element = <HTMLElement>(document.body.appendChild(this.page_element));
	}

	public hide(): void {
		this.overlay_element.classList.remove("anim_fadein");
		this.overlay_element.classList.add("anim_fadeout");

		this.page_element.classList.remove("anim_shovein_bottom");
		this.page_element.classList.add("anim_shoveout_bottom");

		// Unless overridden, any dialog has 300ms to clean everything up before it's removed from the DOM.
		setTimeout(() => {
			this.page_element = <HTMLElement>(this.page_element.parentElement.removeChild(this.page_element));
			this.overlay_element = <HTMLElement>(this.overlay_element.parentElement.removeChild(this.overlay_element));
		}, 300);
	}
}

class DialogAction {
	text: string;
	action: Function;
}