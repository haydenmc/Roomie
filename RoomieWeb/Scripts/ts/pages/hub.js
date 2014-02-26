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
        this.lastPadLoadTime = 0;

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
    Hub.prototype.show = function () {
        _super.prototype.show.call(this);
        if ((new Date()).getTime() - this.lastPadLoadTime > 10000) {
            this.loadPads();
        }
    };

    Hub.prototype.resetPadLoadTime = function () {
        this.lastPadLoadTime = 0;
    };

    Hub.prototype.loadPads = function () {
        var _this = this;
        this.lastPadLoadTime = (new Date()).getTime();

        //If we get rid of this line, we could load pads when page isn't even shown.
        var padsColumn = document.getElementById("PadsList");

        // Check and remove existing pad lists.
        var existingLists = padsColumn.getElementsByTagName("ul");
        if (existingLists.length > 0) {
            existingLists[0].parentNode.removeChild(existingLists[0]);
        }

        var padList = document.createElement("ul");

        var loadingPad = document.createElement("li");
        loadingPad.innerHTML = '<div class="meter"></div><div class="desc">Loading ...</div>';
        loadingPad.classList.add("loading");
        padList.insertBefore(loadingPad, null);

        var addPad = document.createElement("li");
        addPad.innerHTML = '<a href="#"></a><div class="desc">New Pad</div>';
        addPad.classList.add("add");
        addPad.addEventListener("click", function () {
            Application.instance.navigateTo(new NewPad());
        });
        padList.insertBefore(addPad, null);

        padsColumn.insertBefore(padList, null);

        API.pads(function (data) {
            _this.loadPads_success(data);
        }, function () {
            //Todo: Error reporting
        });
    };

    Hub.prototype.loadPads_success = function (pads) {
        var padsColumn = document.getElementById("PadsList");

        // Check and remove existing pad lists.
        var existingLists = padsColumn.getElementsByTagName("ul");
        if (existingLists.length > 0) {
            existingLists[0].parentNode.removeChild(existingLists[0]);
        }

        var padList = document.createElement("ul");

        for (var i = 0; i < pads.length; i++) {
            var padListing = document.createElement("li");
            padListing.innerHTML = '<img src="" /><div class="desc"><span class="address">' + pads[i].streetAddress + '</span><br /><span class="stats">more data here</span></div>';
            padListing.classList.add("pad");
            var padId = pads[i].padId;
            var streetAddress = pads[i].streetAddress;
            (function (p, s) {
                padListing.addEventListener("click", function (e) {
                    Application.instance.navigateTo(new Pad(p, s));
                });
            })(padId, streetAddress);
            padList.insertBefore(padListing, null);
        }

        var addPad = document.createElement("li");
        addPad.innerHTML = '<a href="#"></a><div class="desc">New Pad</div>';
        addPad.classList.add("add");
        addPad.addEventListener("click", function () {
            Application.instance.navigateTo(new NewPad());
        });
        padList.insertBefore(addPad, null);

        padsColumn.insertBefore(padList, null);
    };
    return Hub;
})(Page);
//# sourceMappingURL=hub.js.map
