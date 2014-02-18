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
            Progress.element.classList.add("closed");
            document.body.appendChild(Progress.element);
        }
        if (Progress.element.classList.contains("closed"))
            Progress.element.classList.remove("closed");
    };

    /**
    * hide
    * Called to hide the progress bar when an operation has finished.
    * Progress bar will hide itself when ALL operations have finished.
    */
    Progress.hide = function () {
        Progress.progress_queue--;
        if (Progress.progress_queue <= 0) {
            if (!Progress.element.classList.contains("closed"))
                Progress.element.classList.add("closed");
            Progress.progress_queue = 0;
        }
    };
    Progress.progress_queue = 0;
    return Progress;
})();
//# sourceMappingURL=progress.js.map
