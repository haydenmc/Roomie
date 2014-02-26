var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Pad = (function (_super) {
    __extends(Pad, _super);
    function Pad(pad_id, pad_name) {
        _super.call(this, pad_name);

        var mateList = document.createElement("div");
        mateList.id = "MatesList";
        mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
        this.page_element.appendChild(mateList);

        var chatPane = document.createElement("div");
        chatPane.id = "ChatPane";
        chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1>';
        this.page_element.appendChild(chatPane);

        // Prepare animations
        // Show
        this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
        this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));

        // Hide
        this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
        this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));
    }
    return Pad;
})(Page);
//# sourceMappingURL=pad.js.map
