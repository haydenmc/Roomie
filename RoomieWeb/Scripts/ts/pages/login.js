var LogIn = (function () {
    function LogIn() {
        var _this = this;
        this.name = "Log In";
        this.form_element = document.createElement("div");
        this.form_element.id = "LogIn";
        this.form_element.innerHTML = "<h1>roomie</h1><div class=\"separator\"></div><form><input name=\"email\" placeholder=\"e-mail address\" /><br /><input name=\"password\" type=\"password\" placeholder=\"password\" /><br /><div style=\"text-align:center;\"><input type=\"submit\" value=\"log in\"/><br /><a class=\"register\" href=\"#\">register</a></div></form>";

        this.page_element = document.createElement("div");
        this.page_element.classList.add("page");
        this.form_element = (this.page_element.insertBefore(this.form_element));

        //Bind event handlers.
        this.form_element.getElementsByClassName("register")[0].addEventListener("click", function () {
            _this.register();
        });
        this.form_element.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.authenticate();
            return false;
        });
    }
    LogIn.prototype.register = function () {
        alert("REGISTER!");
    };

    LogIn.prototype.authenticate = function () {
        // If our inputs are disabled, we're probably already trying to authenticate.
        var input_elements = this.form_element.getElementsByTagName("input");
        if (input_elements[0].disabled)
            return;

        // Grab the username and password
        var username = input_elements[0].value;
        var password = input_elements[1].value;

        // Disable input
        input_elements[0].disabled = true;
        input_elements[1].disabled = true;

        // Authenticate!
        $.ajax("/Token", {
            type: "POST",
            data: { grant_type: "password", username: username, password: password },
            success: function () {
                alert("YAY");
            },
            error: function () {
                alert("Boo.");
            }
        });
    };

    LogIn.prototype.show = function () {
        this.page_element = (document.getElementsByTagName("body")[0].insertBefore(this.page_element));
    };

    LogIn.prototype.hide = function () {
    };
    return LogIn;
})();
//# sourceMappingURL=login.js.map
