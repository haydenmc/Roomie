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
            titleElement.innerHTML = this.title;
            this.page_element.appendChild(titleElement);
        }
    }
    Page.prototype.show = function () {
        this.page_element = (document.body.insertBefore(this.page_element));
    };
    Page.prototype.hide = function () {
        this.page_element = (this.page_element.parentNode.removeChild(this.page_element));
    };
    return Page;
})();
//# sourceMappingURL=page.js.map
