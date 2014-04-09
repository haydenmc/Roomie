var Application = (function () {
    function Application() {
        var _this = this;
        // Focus tracker
        this.has_focus = true;
        // Notification count
        this.notification_count = 0;
        this.notification_sound = new Audio("/Content/snd/update.mp3");
        // Page stack!
        this.pages = new Array();
        Application.instance = this; // Set this instance to the global instance
        this.authentication = new Authentication(); // Instantiate authenticator
        this.pad_hub = new PadHub();

        window.onfocus = function (evt) {
            _this.onFocus();
        };
        window.onblur = function (evt) {
            _this.onBlur();
        };
    }
    /**
    * onFocus
    * Occurs when the page is put into focus by the user.
    */
    Application.prototype.onFocus = function () {
        this.has_focus = true;
        this.setNotificationCount(0);
        this.updateTitle();
    };

    /**
    * onBlur
    * Occurs when the page loses focus.
    */
    Application.prototype.onBlur = function () {
        this.has_focus = false;
    };

    /**
    * addNotification
    * Adds one to the notification count and updates title / makes sound / etc.
    */
    Application.prototype.addNotification = function () {
        if (this.has_focus) {
            return;
        }
        this.notification_count++;
        this.notification_sound.play();
        this.updateTitle();
    };

    /**
    * setNotificationCount
    * Sets the count of notifications to the specified amount.
    */
    Application.prototype.setNotificationCount = function (count) {
        this.notification_count = count;
        this.updateTitle();
    };

    /**
    * Updates the title of the window with the current page name and
    * notification count.
    */
    Application.prototype.updateTitle = function () {
        var notification = "";
        if (this.notification_count > 0) {
            notification = "(" + this.notification_count + ") ";
        }
        if (this.pages.length > 0 && this.pages[this.pages.length - 1].title.length > 0) {
            document.title = notification + "roomie / " + this.pages[this.pages.length - 1].title;
        } else {
            document.title = notification + "roomie";
        }
    };

    /**
    * logOut
    * Logs the user out, resets cookies, returns to log in page.
    */
    Application.prototype.logOut = function () {
        this.authentication.logout();
        this.pad_hub.disconnect();
        this.clearPages();
        Application.instance.navigateTo(new LogIn());
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
        hash += char;
    }
    return hash;
};

function guidToColor(guid) {
    if (!guid) {
        return 'hsl(0, 100%, 70%)';
    }
    var color = Math.abs(guid.hashCode()) % 360;
    return 'hsl(' + color + ', 100%, 70%)';
}

window.onload = function () {
    var a = new Application();
    Progress.show();
    a.authentication.validate(function () {
        a.authentication.refresh(function () {
            Progress.hide();
            a.pad_hub.connect();
            a.clearPages();
            a.navigateTo(new Hub());
        }, function () {
            Progress.hide();
            a.clearPages();
            a.navigateTo(new LogIn());
        });
    }, function () {
        Progress.hide();
        a.clearPages();
        a.navigateTo(new LogIn());
    });
};

// Fix for Windows Phone device width. Hideous...
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}
//# sourceMappingURL=application.js.map
