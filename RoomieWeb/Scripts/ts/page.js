var Page = (function () {
    function Page(t) {
        this.title = "";
        if (t) {
            this.title = t;
        }
        this.page_element = document.createElement("div");
        this.page_element.classList.add("page");
        if (Application.instance.hasPages()) {
            var backButtonElement = document.createElement("a");
            backButtonElement.classList.add("back");
            backButtonElement.addEventListener("click", function () {
                Application.instance.navigateBack();
            });
            this.page_element.appendChild(backButtonElement);
        }
        if (this.title.length > 0) {
            var titleElement = document.createElement("h1");
            titleElement.classList.add("title");
            titleElement.classList.add("animation");
            titleElement.classList.add("anim_title_flyin");
            titleElement.innerHTML = this.title;
            this.page_element.appendChild(titleElement);
        }
    }
    Page.prototype.show = function () {
        this.page_element = (document.body.insertBefore(this.page_element, null));
    };
    Page.prototype.hide = function () {
        var _this = this;
        // Title flyout
        var title = (this.page_element.getElementsByClassName("title")[0]);
        if (title) {
            title.classList.remove("anim_title_flyin");
            title.classList.add("anim_title_flyout");
        }

        // Unless this method is overridden, each page has 400ms to animate out
        // before it's cleared from the DOM
        setTimeout(function () {
            _this.page_element = (_this.page_element.parentNode.removeChild(_this.page_element));
        }, 500);
    };
    return Page;
})();
//# sourceMappingURL=page.js.map
