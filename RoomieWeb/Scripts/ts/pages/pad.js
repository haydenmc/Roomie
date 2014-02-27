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
        this.pad_id = pad_id;
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

        this.loadMates();
    }
    Pad.prototype.loadMates = function () {
        var _this = this;
        API.padmates(this.pad_id, function (d) {
            _this.loadMates_success(d);
        }, function () {
        });
    };

    //TODO: Make this update the existing list instead of replacing it entirely...
    Pad.prototype.loadMates_success = function (mates) {
        var matesColumn = document.getElementById("MatesList");

        // Check and remove existing pad lists.
        var existingLists = matesColumn.getElementsByTagName("ul");
        if (existingLists.length > 0) {
            existingLists[0].parentNode.removeChild(existingLists[0]);
        }

        var mateList = document.createElement("ul");

        for (var i = 0; i < mates.length; i++) {
            var mateListing = document.createElement("li");
            mateListing.innerHTML = '<img src="" /><div class="name">' + mates[i].displayName.split(/\b/)[0];
            +'</div>';
            mateListing.classList.add("mate");
            mateList.insertBefore(mateListing, null);
        }

        matesColumn.insertBefore(mateList, null);
    };
    return Pad;
})(Page);
//# sourceMappingURL=pad.js.map
