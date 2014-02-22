var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Hub = (function (_super) {
    __extends(Hub, _super);
    function Hub() {
        _super.call(this, "Roomie");

        // Add Me Tile
        this.page_element.innerHTML += '<div id="MeTile"></div>';

        // Add Pads List
        this.page_element.innerHTML += '<div id="PadsList"><h1 class="listTitle"><div class="gradient"></div>Pads</h1></div>';

        // Add News List
        this.page_element.innerHTML += '<div id="NewsList"><h1 class="listTitle"><div class="gradient"></div>News</h1></div>';

        // Prepare animations
        // Show
        this.show_animations.push(new Animation("#PadsList", "anim_shovein_left"));
        this.show_animations.push(new Animation("#NewsList", "anim_shovein_left"));

        // Hide
        this.show_animations.push(new Animation("#PadsList", "anim_shoveout_right"));
        this.show_animations.push(new Animation("#NewsList", "anim_shoveout_right"));
    }
    return Hub;
})(Page);
//# sourceMappingURL=hub.js.map
