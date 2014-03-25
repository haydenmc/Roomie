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
    Application.auth_credentials = function (username, password, success, failure) {
        API.token(username, password, function (data) {
            Application.update_auth_parameters(data.access_token, data.refresh_token, data.MateId, username, data.DisplayName);
            success(data);
        }, function () {
            failure();
        });
    };
    Application.auth_refresh = function (token, email, success, failure) {
        API.refreshtoken(token, email, function (data) {
            Application.update_auth_parameters(data.access_token, data.refresh_token, data.MateId, email, data.DisplayName);
            success(data);
        }, function () {
            failure();
        });
    };
    Application.update_auth_parameters = function (auth_token, refresh_token, mateid, email, displayname) {
        // Set application parameters
        Application.auth_token = auth_token;
        Application.refresh_token = refresh_token;
        Application.identity_email = email;
        Application.identity_id = mateid;
        Application.identity_displayname = displayname;

        // Set cookies
        var expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + 7);
        Cookies.set_cookie("refresh_token", refresh_token, expireDate);
        Cookies.set_cookie("identity_email", email, expireDate);

        // Reconnect hub if it's not present.
        if (!Application.pad_hub) {
            Application.pad_hub = new PadHub();
        }
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
        Application.auth_token = null;
        Application.refresh_token = null;
        Application.identity_email = null;
        Application.identity_id = null;
        Application.identity_displayname = null;
        Cookies.delete_cookie("refresh_token");
        Cookies.delete_cookie("identity_email");
        Application.pad_hub.disconnect();
        Application.pad_hub = null;
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

    // Check to see if we have a refresh token saved as a cookie.
    var refresh_token = Cookies.get_cookie("refresh_token");
    var identity_email = Cookies.get_cookie("identity_email");
    if (refresh_token == null || identity_email == null) {
        // If not, show log in page.
        a.navigateTo(new LogIn());
    } else {
        // Use the refresh token to request a new auth token
        Progress.show();
        Application.auth_refresh(refresh_token, identity_email, function (data) {
            // On success, navigate to hub.
            Progress.hide();
            a.clearPages();
            a.navigateTo(new Hub());
        }, function () {
            // On failure, 'log out'.
            Progress.hide();
            Application.instance.logOut();
        });
    }
};

// Fix for Windows Phone device width. Hideous...
if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement("style");
    msViewportStyle.appendChild(document.createTextNode("@-ms-viewport{width:auto!important}"));
    document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
}
//# sourceMappingURL=application.js.map
