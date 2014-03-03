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

        var formHTML = "<div id=\"LogIn\">";
        formHTML += "<h1>roomie</h1><div class=\"separator\"></div>";
        formHTML += "<form>";
        formHTML += "<input name=\"email\" placeholder=\"e-mail address\" /><br />";
        formHTML += "<input name=\"password\" type=\"password\" placeholder=\"password\" /><br />";
        formHTML += "<div style=\"text-align:center;\"><input type=\"submit\" value=\"log in\"/><br />";
        formHTML += "<a class=\"register\" href=\"#\">register</a></div>";
        formHTML += "</form></div>";
        this.page_element.innerHTML += formHTML;

        // Add animations
        // Show
        this.show_animations.push(new Animation("#LogIn h1", "anim_shovein_left")); // Title shoves left
        this.show_animations.push(new Animation("#LogIn form", "anim_shovein_right")); //Form shoves right
        this.show_animations.push(new Animation("#LogIn .separator", "anim_fadein")); //Separator fades out

        // Hide
        this.hide_animations.push(new Animation("#LogIn h1", "anim_shoveout_left")); // Title shoves left
        this.hide_animations.push(new Animation("#LogIn form", "anim_shoveout_right")); //Form shoves right
        this.hide_animations.push(new Animation("#LogIn .separator", "anim_fadeout")); //Separator fades out

        //Bind event handlers.
        this.page_element.getElementsByClassName("register")[0].addEventListener("click", function () {
            _this.register();
        });
        this.page_element.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.authenticate();
        });
    }
    //public show(): void {
    //	super.show();
    //	// Clear old animations...
    //	var roomie_title = document.getElementById("LogIn").getElementsByTagName("h1")[0];
    //	if (roomie_title.classList.contains("animation")) roomie_title.classList.remove("animation");
    //	if (roomie_title.classList.contains("anim_shoveout_left")) roomie_title.classList.remove("anim_shoveout_left");
    //	var form_element = this.page_element.getElementsByTagName("form")[0];
    //	if (form_element.classList.contains("animation")) form_element.classList.remove("animation");
    //	if (form_element.classList.contains("anim_shoveout_right")) form_element.classList.remove("anim_shoveout_right");
    //}
    //public hide(): void {
    //	super.hide();
    //	// Animate out
    //	var roomie_title = document.getElementById("LogIn").getElementsByTagName("h1")[0];
    //	roomie_title.classList.add("animation");
    //	roomie_title.classList.add("anim_shoveout_left");
    //	var form_element = this.page_element.getElementsByTagName("form")[0];
    //	form_element.classList.add("animation");
    //	form_element.classList.add("anim_shoveout_right");
    //}
    LogIn.prototype.register = function () {
        Application.instance.navigateTo(new Register());
    };

    LogIn.prototype.authenticate = function () {
        // If our inputs are disabled, we're probably already trying to authenticate.
        var input_elements = this.page_element.getElementsByTagName("input");
        if (input_elements[0].disabled) {
            return;
        }

        // Grab the username and password
        var username = input_elements[0].value;
        var password = input_elements[1].value;

        // Disable input
        input_elements[0].disabled = true;
        input_elements[1].disabled = true;

        // Show the progress bar
        Progress.show();

        // Authenticate!
        API.token(username, password, function (data) {
            // Hide the progress bar
            Progress.hide();

            // Get our auth token
            Application.set_auth_token(data.access_token);

            // Navigate to hub!
            Application.instance.clearPages();
            Application.instance.navigateTo(new Hub());
        }, function () {
            alert("Boo.");

            // Hide the progress bar
            Progress.hide();

            // Re-enable inputs
            input_elements[0].disabled = false;
            input_elements[1].disabled = false;
        });
    };
    return LogIn;
})(Page);
//# sourceMappingURL=login.js.map
