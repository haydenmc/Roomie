var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var LogIn = (function (_super) {
    __extends(LogIn, _super);
    function LogIn() {
        var _this = this;
        _super.call(this);
        this.page_element.innerHTML += "<div id=\"LogIn\"><h1>roomie</h1><div class=\"separator\"></div><form><input name=\"email\" placeholder=\"e-mail address\" /><br /><input name=\"password\" type=\"password\" placeholder=\"password\" /><br /><div style=\"text-align:center;\"><input type=\"submit\" value=\"log in\"/><br /><a class=\"register\" href=\"#\">register</a></div></form></div>";

        //Bind event handlers.
        this.page_element.getElementsByClassName("register")[0].addEventListener("click", function () {
            _this.register();
        });
        this.page_element.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.authenticate();
        });
    }
    LogIn.prototype.show = function () {
        _super.prototype.show.call(this);

        // Clear old animations...
        var roomie_title = document.getElementById("LogIn").getElementsByTagName("h1")[0];
        if (roomie_title.classList.contains("animation"))
            roomie_title.classList.remove("animation");
        if (roomie_title.classList.contains("anim_shoveout_left"))
            roomie_title.classList.remove("anim_shoveout_left");
        var form_element = this.page_element.getElementsByTagName("form")[0];
        if (form_element.classList.contains("animation"))
            form_element.classList.remove("animation");
        if (form_element.classList.contains("anim_shoveout_right"))
            form_element.classList.remove("anim_shoveout_right");
    };

    LogIn.prototype.hide = function () {
        _super.prototype.hide.call(this);

        // Animate out
        var roomie_title = document.getElementById("LogIn").getElementsByTagName("h1")[0];
        roomie_title.classList.add("animation");
        roomie_title.classList.add("anim_shoveout_left");
        var form_element = this.page_element.getElementsByTagName("form")[0];
        form_element.classList.add("animation");
        form_element.classList.add("anim_shoveout_right");
    };

    LogIn.prototype.register = function () {
        Application.instance.navigateTo(new Register());
    };

    LogIn.prototype.authenticate = function () {
        // If our inputs are disabled, we're probably already trying to authenticate.
        var input_elements = this.page_element.getElementsByTagName("input");
        if (input_elements[0].disabled)
            return;

        // Grab the username and password
        var username = input_elements[0].value;
        var password = input_elements[1].value;

        // Disable input
        input_elements[0].disabled = true;
        input_elements[1].disabled = true;

        // Show the progress bar
        Progress.show();

        // Authenticate!
        $.ajax("/Token", {
            type: "POST",
            dataType: "JSON",
            data: { grant_type: "password", username: username, password: password },
            success: function (data) {
                // Hide the progress bar
                Progress.hide();

                // Navigate to hub!
                Application.instance.clearPages();
                Application.instance.navigateTo(new Hub());
            },
            error: function () {
                alert("Boo.");

                // Hide the progress bar
                Progress.hide();

                // Re-enable inputs
                input_elements[0].disabled = false;
                input_elements[1].disabled = false;
            }
        });
    };
    return LogIn;
})(Page);
//# sourceMappingURL=login.js.map
