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
        this.typingTimeouts = {};
        this.lastTypingTime = 0;
        this.pad_id = pad_id;
        var mateList = document.createElement("div");
        mateList.id = "MatesList";
        mateList.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Mates</h1>';
        this.page_element.appendChild(mateList);

        var chatPane = document.createElement("div");
        chatPane.id = "ChatPane";
        chatPane.innerHTML = '<h1 class="listTitle"><div class="gradient"></div>Chat</h1>' + '<ul class="chatlist" ></ul>' + '<form class="messageEntry" >' + '<input type="text" name="body" placeholder ="type your message" autocomplete="off" />' + '<input type="submit" value="Send" /></form>';
        this.page_element.appendChild(chatPane);

        // Set up event handlers ...
        chatPane.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.sendMessage();
        });
        chatPane.getElementsByTagName("input")[0].addEventListener("keypress", function (evt) {
            _this.typing();
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

    Pad.prototype.typing = function () {
        if ((new Date()).getTime() - this.lastTypingTime > 1000) {
            console.log("I'm typing...");
            this.lastTypingTime = (new Date()).getTime();
            Application.pad_hub.typing(this.pad_id);
        }
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
        var _this = this;
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
            mateListing.innerHTML = '<div class="usericon" style="border-left-color: ' + guidToColor(mates[i].mateId) + ';"><img src="" /></div><div class="name">' + mates[i].displayName.split(/\b/)[0];
            +'</div>';
            mateListing.classList.add("mate");
            mateList.insertBefore(mateListing, null);
        }

        var addListing = document.createElement("li");
        addListing.innerHTML = '<a href="#"></a><div class="desc">Invite</div>';
        addListing.classList.add("add");
        addListing.addEventListener("click", function () {
            _this.showInviteDialog();
        });
        mateList.insertBefore(addListing, null);

        matesColumn.insertBefore(mateList, null);
    };

    Pad.prototype.showInviteDialog = function () {
        var invite_dialog = new InviteDialog(this.pad_id);
        invite_dialog.show();
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
            html += this.formatMessage(data[i].mateId, data[i].body, new Date(data[i].sendTime), true);
        }
        var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
        messagelist.innerHTML = html + messagelist.innerHTML;

        // Scroll to bottom
        messagelist.scrollTop = messagelist.scrollHeight;
    };

    /**
    * Returns a formatted message in either HTML string or HTMLElement
    */
    Pad.prototype.formatMessage = function (mateid, body, sendtime, html) {
        var color = guidToColor(mateid);
        body = htmlEscape(body);
        body = Autolinker.link(body, { truncate: 128, stripPrefix: true, newWindow: true, twitter: false });
        var contents = '<div class="idstrip" style="background-color: ' + color + ';"></div>' + '<div class="message">' + '<div class="body" > ' + body + ' </div > ' + '<div class="information">' + '<div class="name">' + this.guidToDisplayName(mateid) + '</div>' + '<div class="time">' + this.friendlyDateTime(sendtime) + '</div>' + '</div>' + '</div>' + '</div>';
        if (html) {
            return '<li class="animation anim_fadein">' + contents + '</li>';
        } else {
            var msgElement = document.createElement("li");
            msgElement.classList.add("animation");
            msgElement.classList.add("anim_shovein_left");
            msgElement.innerHTML = contents;
            return msgElement;
        }
    };

    Pad.prototype.friendlyDateTime = function (date) {
        var d = new Date();
        if (date.getDate() != d.getDate() || date.getMonth() != d.getMonth() || date.getFullYear() != d.getFullYear()) {
            return date.toLocaleDateString() + " " + date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
        }
        return date.getHours() + ":" + ('0' + date.getMinutes()).slice(-2) + ":" + ('0' + date.getSeconds()).slice(-2);
    };

    Pad.prototype.guidToDisplayName = function (guid) {
        var dname = "Unknown User";
        for (var i = 0; i < this.mates.length; i++) {
            if (this.mates[i].mateId === guid) {
                dname = this.mates[i].displayName;
                break;
            }
        }
        return dname;
    };

    // SIGNALR HUB METHOD
    Pad.prototype.messageReceived = function (user_id, pad_id, body, time) {
        if (pad_id !== this.pad_id) {
            return;
        }

        // Build the message element
        var msgElement = (this.formatMessage(user_id, body, new Date(time)));

        var messagelist = document.getElementById("ChatPane").getElementsByTagName("ul")[0];
        var style = window.getComputedStyle(messagelist, null);
        var innerheight = parseInt(style.getPropertyValue("height"));
        var scroll = (messagelist.scrollHeight - (innerheight + messagelist.scrollTop) <= 16);
        messagelist.appendChild(msgElement);
        if (scroll) {
            // Scroll to bottom
            messagelist.scrollTop = messagelist.scrollHeight;
        }

        // Notification
        Application.instance.addNotification();
    };

    // SIGNALR HUB METHOD
    Pad.prototype.mateJoined = function (pad_id, mate) {
        if (pad_id !== this.pad_id) {
            return;
        }

        this.loadMates(); // Reload mates
    };

    // SIGNALR HUB METHOD
    Pad.prototype.mateTyping = function (pad_id, mate) {
        if (pad_id !== this.pad_id) {
            return;
        }
        console.log("Typing from '" + mate.DisplayName + "'.");
        if (this.typingTimeouts[mate.MateId]) {
            clearTimeout(this.typingTimeouts[mate.MateId]);
        }
        var i;
        for (i = 0; i < this.mates.length; i++) {
            if (this.mates[i].mateId == mate.MateId) {
                break;
            }
        }
        var matesList = document.getElementById("MatesList").getElementsByTagName("ul")[0];
        var mateItem = (matesList.childNodes[i]);
        if (!mateItem.classList.contains("typing")) {
            mateItem.classList.add("typing");
        }
        this.typingTimeouts[mate.MateId] = setTimeout(function () {
            mateItem.classList.remove("typing");
        }, 2000);
    };

    Pad.prototype.show = function () {
        _super.prototype.show.call(this);
        Application.pad_hub.setPadPage(this);
    };

    Pad.prototype.hide = function () {
        _super.prototype.hide.call(this);
        Application.pad_hub.clearPadPage(this);
    };
    return Pad;
})(Page);
//# sourceMappingURL=pad.js.map
