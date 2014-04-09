var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NewPad = (function (_super) {
    __extends(NewPad, _super);
    function NewPad() {
        var _this = this;
        _super.call(this, "New Pad");

        var form = document.createElement("form");
        form.id = "NewPad";
        var formhtml = '<input name = "StreetAddress" placeholder = "Street Address">';
        formhtml += '<br /><input name="ZipCode" placeholder = "Zip Code">';
        formhtml += '<br /><input type="submit" value="Create">';
        form.innerHTML = formhtml;
        form.addEventListener("submit", function (evt) {
            var inputs = _this.page_element.getElementsByTagName("input");

            // If one of the inputs is already disabled, we're already submitting.
            if (inputs[0].disabled) {
                return;
            }

            for (var i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }
            evt.preventDefault();

            // Show the progress bar
            Progress.show();

            // Call the API
            API.newpad(inputs[0].value, inputs[1].value, function (data) {
                // On success ...
                Progress.hide();
                Application.instance.pad_hub.refreshGroups(); // Refresh SignalR group membership...
                if (Application.instance.pages[Application.instance.pages.length - 2] instanceof Hub) {
                    (Application.instance.pages[Application.instance.pages.length - 2]).resetPadLoadTime(); // Reload pads
                }
                Application.instance.navigateBack();
            }, function () {
                // On error ...
                // TODO: Better error handling.
                Progress.hide();
                alert("ERROR CREATING PAD");
                Application.instance.navigateBack();
            });
        });
        this.page_element.appendChild(form);

        // Prepare animations
        // Show
        this.show_animations.push(new Animation("#NewPad", "anim_shovein_bottom"));

        // Hide
        this.hide_animations.push(new Animation("#NewPad", "anim_shoveout_bottom"));
    }
    return NewPad;
})(Page);
//# sourceMappingURL=newpad.js.map
