/* Progress Indicator */
class Progress {
	public static element: HTMLElement; // HTML Element on the page
	public static progress_queue: number = 0; // How many operations are taking place
	/**
	 * show
	 * Called to show a progress bar when an operation is taking place.
	 * Queue of operations is incremented.
	 */
	public static show(): void {
		Progress.progress_queue++;
		if (!Progress.element) {
			Progress.element = document.createElement("div");
			Progress.element.classList.add("progress");
			document.body.appendChild(Progress.element);
		} else {
			Progress.element.hidden = false;
		}
	}
	/**
	 * hide
	 * Called to hide the progress bar when an operation has finished.
	 * Progress bar will hide itself when ALL operations have finished.
	 */
	public static hide(): void {
		Progress.progress_queue--;
		if (Progress.progress_queue <= 0) {
			Progress.element.hidden = true;
			Progress.progress_queue = 0;
		}
	}
} 