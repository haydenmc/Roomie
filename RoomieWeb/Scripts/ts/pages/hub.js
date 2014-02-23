var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Hub = (function (_super) {
    __extends(Hub, _super);
    function Hub() {
        var _this = this;
        _super.call(this, "Roomie");

        // Add Me Tile
        this.page_element.innerHTML += '<div id="MeTile"><div class="dimmer"></div><a href="#" class="meText">Me</a></div>';

        // Add Pads List
        this.page_element.innerHTML += '<div id="PadsList"><h1 class="listTitle"><div class="gradient"></div>Pads</h1></div>';

        // Add News List
        this.page_element.innerHTML += '<div id="NewsList"><h1 class="listTitle"><div class="gradient"></div>News</h1></div>';

        // Prepare animations
        // Show
        this.show_animations.push(new Animation("#PadsList", "anim_shovein_left"));
        this.show_animations.push(new Animation("#NewsList", "anim_shovein_left"));
        this.show_animations.push(new Animation("#MeTile", "anim_fadein"));

        // Hide
        this.hide_animations.push(new Animation("#PadsList", "anim_shoveout_right"));
        this.hide_animations.push(new Animation("#NewsList", "anim_shoveout_right"));
        this.hide_animations.push(new Animation("#MeTile", "anim_fadeout"));

        setTimeout(function () {
            _this.loadPads();
        }, 100);
    }
    Hub.prototype.loadPads = function () {
        var padsColumn = document.getElementById("PadsList");
        var padList = document.createElement("ul");

        var testPad = document.createElement("li");
        testPad.innerHTML = '<img src="" /><div class="desc"><span class="address">2121 Malibu Drive</span><br /><span class="stats">6 mates, Indiana</span></div>';
        testPad.classList.add("pad");
        padList.insertBefore(testPad, null);

        testPad = document.createElement("li");
        testPad.innerHTML = '<img src="" /><div class="desc"><span class="address">100 E North Avenue</span><br /><span class="stats">4 mates, Illinois</span></div>';
        testPad.classList.add("pad");
        padList.insertBefore(testPad, null);

        testPad = document.createElement("li");
        testPad.innerHTML = '<a href="#"></a><div class="desc">New Pad</div>';
        testPad.classList.add("add");
        testPad.addEventListener("click", function () {
            Application.instance.navigateTo(new NewPad());
        });
        padList.insertBefore(testPad, null);

        padsColumn.insertBefore(padList, null);
    };
    return Hub;
})(Page);
//# sourceMappingURL=hub.js.map
