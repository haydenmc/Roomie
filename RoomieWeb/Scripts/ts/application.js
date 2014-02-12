var Application = (function () {
    function Application() {
        // Page stack!
        this.pages = new Array();
        Application.instance = this;
    }
    /**
    * navigateTo
    * Navigate to a specific page and add it to the page stack.
    */
    Application.prototype.navigateTo = function (page) {
        this.pages.push(page);
        if (this.pages.length > 1) {
            this.pages[this.pages.length - 2].hide();
        }
        this.pages[this.pages.length - 1].show();
    };

    /**
    * navigateBack
    * Navigate back to the previous page, removing current page from page stack.
    */
    Application.prototype.navigateBack = function () {
        if (this.pages.length > 1) {
            this.pages.pop().hide();
            this.pages[this.pages.length - 1].show();
        }
    };
    return Application;
})();

window.onload = function () {
    (new Application()).navigateTo(new LogIn());
};
//# sourceMappingURL=application.js.map
