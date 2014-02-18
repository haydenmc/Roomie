/* Progress Indicator */
var Progress = (function () {
    function Progress() {
    }
    /**
    * show
    * Called to show a progress bar when an operation is taking place.
    * Queue of operations is incremented.
    */
    Progress.show = function () {
        Progress.progress_queue++;
        if (!Progress.element) {
            Progress.element = document.createElement("div");
            Progress.element.classList.add("progress");
            document.body.appendChild(Progress.element);
        } else {
            Progress.element.hidden = false;
        }
    };

    /**
    * hide
    * Called to hide the progress bar when an operation has finished.
    * Progress bar will hide itself when ALL operations have finished.
    */
    Progress.hide = function () {
        Progress.progress_queue--;
        if (Progress.progress_queue <= 0) {
            Progress.element.hidden = true;
            Progress.progress_queue = 0;
        }
    };
    Progress.progress_queue = 0;
    return Progress;
})();
//# sourceMappingURL=progress.js.map
