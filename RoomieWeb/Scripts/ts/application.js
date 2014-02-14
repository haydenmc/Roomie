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

    /**
    * canGoBack
    * Returns true if there is enough room on the page stack to go back.
    * False otherwise.
    */
    Application.prototype.canGoBack = function () {
        return (this.pages.length > 1);
    };

    /**
    * hasPages
    * Returns true if the page stack has at least one page.
    */
    Application.prototype.hasPages = function () {
        return (this.pages.length > 0);
    };
    return Application;
})();

window.onload = function () {
    (new Application()).navigateTo(new LogIn());
};
//# sourceMappingURL=application.js.map
