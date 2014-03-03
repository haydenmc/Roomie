var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Mate = (function () {
    function Mate() {
    }
    return Mate;
})();

var Pad = (function (_super) {
    __extends(Pad, _super);
    function Pad(pad_id, pad_name) {
        var _this = this;
        _super.call(this, pad_name);
        this.pad_id = pad_id;
        var mateList = document.createElement("div");
        mateList.id = "MatesList";
        mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
        this.page_element.appendChild(mateList);

        var chatPane = document.createElement("div");
        chatPane.id = "ChatPane";
        chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1>' + '<ul class="chatlist" ></ul>' + '<form class="messageEntry" >' + '<input type = "text" name = "body" placeholder ="type your message" / >' + '<input type = "submit" value ="Send" /></form>';
        this.page_element.appendChild(chatPane);

        // Set up event handlers ...
        chatPane.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.sendMessage();
        });

        // Prepare animations
        // Show
        this.show_animations.push(new Animation("#MatesList", "anim_shovein_left"));
        this.show_animations.push(new Animation("#ChatPane", "anim_shovein_left"));

        // Hide
        this.hide_animations.push(new Animation("#MatesList", "anim_shoveout_right"));
        this.hide_animations.push(new Animation("#ChatPane", "anim_shoveout_right"));

        // Load mates, and load history AFTER mates (we need mate list to associate IDs with names)
        this.loadMates(function () {
            _this.loadHistory();
        });
    }
    Pad.prototype.sendMessage = function () {
        var input = this.page_element.getElementsByTagName("input")[0];
        Application.pad_hub.sendMessage(this.pad_id, input.value);
        input.value = '';

        // Scroll to bottom
        var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
        messagelist.scrollTop = messagelist.scrollHeight;
        input.focus();
    };

    Pad.prototype.loadMates = function (f) {
        var _this = this;
        API.padmates(this.pad_id, function (d) {
            _this.loadMates_success(d);
            if (f) {
                f();
            }
        }, function () {
        });
    };

    //TODO: Make this update the existing list instead of replacing it entirely...
    Pad.prototype.loadMates_success = function (mates) {
        this.mates = mates;
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

    Pad.prototype.loadHistory = function () {
        var _this = this;
        // TODO: Deal with failure.
        API.padmessages(this.pad_id, function (d) {
            _this.loadHistory_success(d);
        }, function () {
        });
    };

    Pad.prototype.loadHistory_success = function (data) {
        var html = '';
        for (var i = 0; i < data.length; i++) {
            html += '<li class="animation anim_fadein">' + '<div class="body" > ' + data[i].body + ' </div > ' + '<div class="information">' + '<div class="name">' + this.guidToDisplayName(data[i].mateId) + '</div>' + '<div class="time">' + this.friendlyDateTime(new Date(data[i].sendTime)) + '</div>' + '</div>' + '</div>' + '</li>';
        }
        var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
        messagelist.innerHTML = html + messagelist.innerHTML;

        // Scroll to bottom
        messagelist.scrollTop = messagelist.scrollHeight;
    };

    Pad.prototype.friendlyDateTime = function (date) {
        return date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
    };

    Pad.prototype.guidToDisplayName = function (guid) {
        var dname = "Unknown User";
        for (var i = 0; i < this.mates.length; i++) {
            if (this.mates[i].mateId == guid) {
                var dname = this.mates[i].displayName;
                break;
            }
        }
        return dname;
    };

    Pad.prototype.messageReceived = function (user_id, pad_id, body, time) {
        if (pad_id != this.pad_id)
            return;

        // Clean the message body
        var cleanBody = htmlEscape(body);

        // Find the user
        var dname = this.guidToDisplayName(user_id);

        // Format the date
        var date = new Date(time);
        var friendlyDate = this.friendlyDateTime(date);

        // Build the message element
        var msgElement = document.createElement("li");
        msgElement.classList.add("animation");
        msgElement.classList.add("anim_shovein_left");
        msgElement.innerHTML = '<div class="body">' + cleanBody + '</div>' + '<div class="information">' + '<div class="name">' + dname + '</div>' + '<div class="time">' + friendlyDate + '</div>' + '</div>' + '</div>';

        var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
        var style = window.getComputedStyle(messagelist, null);
        var innerheight = parseInt(style.getPropertyValue("height"));
        var scroll = (messagelist.scrollHeight - (innerheight + messagelist.scrollTop) <= 16);
        messagelist.appendChild(msgElement);
        if (scroll) {
            // Scroll to bottom
            messagelist.scrollTop = messagelist.scrollHeight;
        }
    };

    Pad.prototype.show = function () {
        var _this = this;
        _super.prototype.show.call(this);

        Application.pad_hub.assignMessageReceived(function (user_id, pad_id, body, time) {
            _this.messageReceived(user_id, pad_id, body, time);
        });
    };
    return Pad;
})(Page);
//# sourceMappingURL=pad.js.map
