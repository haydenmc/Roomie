var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var NewPad = (function (_super) {
    __extends(NewPad, _super);
    function NewPad() {
        _super.call(this, "New Pad");

        var form = document.createElement("form");
        form.id = "NewPad";
        var formhtml = '<input name = "StreetAddress" placeholder = "Street Address">';
        formhtml += '<br /><input name="ZipCode" placeholder = "Zip Code">';
        formhtml += '<br /><input type="submit" value="Create">';
        form.innerHTML = formhtml;
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
