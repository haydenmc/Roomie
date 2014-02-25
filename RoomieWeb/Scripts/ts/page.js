var Page = (function () {
    function Page(t) {
        this.title = "";
        this.show_animations = new Array();
        this.hide_animations = new Array();
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

            // Back button animations
            this.show_animations.push(new Animation("a.back", "anim_shovein_left"));
            this.hide_animations.push(new Animation("a.back", "anim_shoveout_left"));
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
        // If scheduled to remove page, cancel timer.
        if (this.timeout_handle > 0) {
            clearTimeout(this.timeout_handle);
            this.timeout_handle = 0;
        }
        this.page_element = (document.body.insertBefore(this.page_element, null));

        // Title flyin
        var title = (this.page_element.getElementsByClassName("title")[0]);
        if (title && title.classList.contains("anim_title_flyout")) {
            title.classList.remove("anim_title_flyout");
            title.classList.add("anim_title_flyin");
        }
        for (var i = 0; i < this.hide_animations.length; i++) {
            this.hide_animations[i].clear(this.page_element);
        }
        for (var j = 0; j < this.show_animations.length; j++) {
            this.show_animations[j].apply(this.page_element);
        }
    };
    Page.prototype.hide = function () {
        var _this = this;
        // Title flyout
        var title = (this.page_element.getElementsByClassName("title")[0]);
        if (title) {
            title.classList.remove("anim_title_flyin");
            title.classList.add("anim_title_flyout");
        }

        for (var i = 0; i < this.hide_animations.length; i++) {
            this.show_animations[i].clear(this.page_element);
        }
        for (var j = 0; j < this.show_animations.length; j++) {
            this.hide_animations[j].apply(this.page_element);
        }

        // before it's cleared from the DOM
        this.timeout_handle = setTimeout(function () {
            _this.page_element = (_this.page_element.parentNode.removeChild(_this.page_element));
        }, 500);
    };
    return Page;
})();
//# sourceMappingURL=page.js.map
