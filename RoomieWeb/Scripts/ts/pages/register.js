var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Register = (function (_super) {
    __extends(Register, _super);
    function Register() {
        _super.call(this, "Register");

        // Generate Registration form
        var form = document.createElement("div");
        form.id = "Register";
        form.innerHTML = '<form class="register"><input type="email" name="email" placeholder="e-mail address" /><br /><input type="text" name="displayname" placeholder="display name" /><br /><input type="password" name="password" placeholder="password" /><br /><input type="password" name="confirmpassword" placeholder="confirm password" /><input type="submit" value="register" /></form>';

        // Insert into page.
        this.page_element.insertBefore(form, null);
    }
    return Register;
})(Page);
//# sourceMappingURL=register.js.map
