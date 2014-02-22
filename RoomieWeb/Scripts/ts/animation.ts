/**
 * This class will apply an animation to the elements found by the 'selector'.
 */
class Animation {
	public selector: string;
	public animation_name: string;

	constructor(s: string, anim: string) {
		this.selector = s;
		this.animation_name = anim;
	}

	public apply(base_element: HTMLElement): void
	{
		var elements = $(base_element).find(this.selector);
		elements.addClass("animation");
		elements.addClass(this.animation_name);
	}

	public clear(base_element: HTMLElement): void {
		var elements = $(base_element).find(this.selector);
		elements.removeClass("animation");
		elements.removeClass(this.animation_name);
	}
} 