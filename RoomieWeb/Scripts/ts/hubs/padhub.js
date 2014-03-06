var PadHub = (function () {
    function PadHub() {
        var _this = this;
        this.hub = $.connection.padHub;
        this.ready = false;
        this.hub.client.messageReceived = function (userid, padid, body, time) {
            _this.messageReceived(userid, padid, body, time);
        };
        this.hub.client.mateJoined = function (padid, mate) {
            _this.mateJoined(padid, mate);
        };
        this.hub.client.systemMessage = function (body) {
            _this.systemMessage(body);
        };
        $.connection.hub.start().done(function () {
            _this.ready = true;
        });
    }
    PadHub.prototype.setPadPage = function (page) {
        this.currentPadPage = page;
    };

    PadHub.prototype.clearPadPage = function (page) {
        if (this.currentPadPage == page) {
            this.currentPadPage = null;
        }
    };

    /* Client-side methods*/
    PadHub.prototype.messageReceived = function (userid, padid, body, time) {
        if (this.currentPadPage) {
            this.currentPadPage.messageReceived(userid, padid, body, time);
        } else {
            console.log("Message @ " + time + " from '" + userid + "': " + body);
        }
    };

    PadHub.prototype.mateJoined = function (padid, mate) {
        console.log("MATE JOINED");
        if (this.currentPadPage) {
            this.currentPadPage.mateJoined(padid, mate);
        } else {
            console.log(mate.displayName + " joined one of your pads.");
        }
    };

    PadHub.prototype.systemMessage = function (body) {
        console.log("SYSTEM: " + body);
    };

    /* Server-side methods */
    PadHub.prototype.sendMessage = function (padid, body) {
        this.hub.server.sendMessage(padid, body);
    };

    PadHub.prototype.refreshGroups = function () {
        this.hub.server.refreshGroups();
    };
    return PadHub;
})();
//# sourceMappingURL=padhub.js.map
