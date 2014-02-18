var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Register = (function (_super) {
    __extends(Register, _super);
    function Register() {
        var _this = this;
        _super.call(this, "Register");

        // Generate Registration form
        var form = document.createElement("div");
        form.id = "Register";
        form.innerHTML = '<form class="register"><input type="email" name="Email" placeholder="e-mail address" /><br /><input type="text" name="DisplayName" placeholder="display name" /><br /><input type="password" name="Password" placeholder="password" /><br /><input type="password" name="ConfirmPassword" placeholder="confirm password" /><input type="submit" value="register" /></form>';

        form.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.submit();
        });

        // Insert into page.
        this.page_element.insertBefore(form, null);
    }
    /**
    * submit
    * Called when submitting the registration form.
    */
    Register.prototype.submit = function () {
        // Get the inputs
        var inputs = this.page_element.getElementsByTagName("input");

        // If the input is already disabled, we're probably trying to register already.
        if (inputs[0].disabled == true)
            return;

        // Show progress indicator
        Progress.show();

        // Disable input boxes
        inputs[0].disabled = true;
        inputs[1].disabled = true;
        inputs[2].disabled = true;
        inputs[3].disabled = true;

        // Fetch input values
        var email = inputs[0].value;
        var displayname = inputs[1].value;
        var password = inputs[2].value;
        var confirmpassword = inputs[3].value;

        // Call API
        $.ajax("/api/Account/Register", {
            type: "POST",
            data: { Email: email, DisplayName: displayname, Password: password, ConfirmPassword: confirmpassword },
            success: function () {
                Progress.hide(); // Hide the progress bar.
                alert("account created!");
                inputs[0].disabled = false;
                inputs[1].disabled = false;
                inputs[2].disabled = false;
                inputs[3].disabled = false;
            },
            error: function () {
                Progress.hide(); // Hide the progress bar.
                alert("failure.");
                inputs[0].disabled = false;
                inputs[1].disabled = false;
                inputs[2].disabled = false;
                inputs[3].disabled = false;
            }
        });
    };
    return Register;
})(Page);
//# sourceMappingURL=register.js.map
