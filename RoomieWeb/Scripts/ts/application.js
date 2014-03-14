var Application = (function () {
    function Application() {
        var _this = this;
        // Page stack!
        this.pages = new Array();
        Application.instance = this;

        window.onfocus = function (evt) {
            _this.onFocus();
        };
        window.onblur = function (evt) {
            _this.onBlur();
        };
    }
    /* Static Methods */
    Application.set_auth_token = function (token) {
        Application.auth_token = token;
        Application.pad_hub = new PadHub(); // Connect to SignalR Hub
    };

    /**
    * onFocus
    * Occurs when the page is put into focus by the user.
    */
    Application.prototype.onFocus = function () {
        Application.has_focus = true;
        this.setNotificationCount(0);
        this.updateTitle();
    };

    /**
    * onBlur
    * Occurs when the page loses focus.
    */
    Application.prototype.onBlur = function () {
        Application.has_focus = false;
    };

    /**
    * addNotification
    * Adds one to the notification count and updates title / makes sound / etc.
    */
    Application.prototype.addNotification = function () {
        if (Application.has_focus) {
            return;
        }
        Application.notification_count++;
        Application.notification_sound.play();
        this.updateTitle();
    };

    /**
    * setNotificationCount
    * Sets the count of notifications to the specified amount.
    */
    Application.prototype.setNotificationCount = function (count) {
        Application.notification_count = count;
        this.updateTitle();
    };

    /**
    * Updates the title of the window with the current page name and
    * notification count.
    */
    Application.prototype.updateTitle = function () {
        var notification = "";
        if (Application.notification_count > 0) {
            notification = "(" + Application.notification_count + ") ";
        }
        if (this.pages[this.pages.length - 1].title.length > 0) {
            document.title = notification + "roomie / " + this.pages[this.pages.length - 1].title;
        } else {
            document.title = notification + "roomie";
        }
    };

    /**
    * clearPages
    * Clears the page stack history and hides the last page present.
    */
    Application.prototype.clearPages = function () {
        if (this.pages.length >= 1) {
            this.pages[this.pages.length - 1].hide();
        }
        this.pages = new Array();
    };

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
        this.updateTitle();
    };

    /**
    * navigateBack
    * Navigate back to the previous page, removing current page from page stack.
    */
    Application.prototype.navigateBack = function () {
        if (this.pages.length > 1) {
            this.pages.pop().hide();
            this.pages[this.pages.length - 1].show();
            this.updateTitle();
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
    Application.has_focus = true;

    Application.notification_count = 0;
    Application.notification_sound = new Audio("/Content/snd/update.mp3");
    return Application;
})();

/* Some global functions for browser compatibility, etc. */
var pfx = ["webkit", "moz", "MS", "o", ""];
function PrefixedEvent(element, type, callback) {
    for (var p = 0; p < pfx.length; p++) {
        if (!pfx[p]) {
            type = type.toLowerCase();
        }
        element.addEventListener(pfx[p] + type, callback, false);
    }
}

function htmlEscape(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

String.prototype.hashCode = function () {
    var hash = 0;
    if (this.length == 0)
        return hash;
    for (var i = 0; i < this.length; i++) {
        var char = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};

window.onload = function () {
    (new Application()).navigateTo(new LogIn());
};
//# sourceMappingURL=application.js.map
