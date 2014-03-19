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
        this.hub.client.inviteReceived = function (invite) {
            _this.inviteReceived(invite);
        };
        $.connection.hub.start().done(function () {
            _this.ready = true;
        });
    }
    PadHub.prototype.disconnect = function () {
        $.connection.hub.stop();
    };

    PadHub.prototype.setPadPage = function (page) {
        this.currentPadPage = page;
    };

    PadHub.prototype.clearPadPage = function (page) {
        if (this.currentPadPage === page) {
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

    PadHub.prototype.inviteReceived = function (invite) {
        console.log("RECEIVED INVITE: ");
        console.dir(invite);

        // If we're on the hub page, reload them invites.
        if (Application.instance.pages[Application.instance.pages.length - 1] instanceof Hub) {
            Application.instance.pages[Application.instance.pages.length - 1].loadInvites();
        }
    };

    PadHub.prototype.systemMessage = function (body) {
        console.log("SYSTEM: " + body);
    };

    /* Server-side methods */
    PadHub.prototype.sendMessage = function (padid, body) {
        this.hub.server.sendMessage(padid, body).fail(function () {
            alert("FAILURE sending message to server");
        });
    };

    PadHub.prototype.refreshGroups = function () {
        this.hub.server.refreshGroups();
    };
    return PadHub;
})();
//# sourceMappingURL=padhub.js.map
