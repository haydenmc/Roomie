var PadHub = (function () {
    function PadHub() {
        var _this = this;
        this.hub = $.connection.padHub;
        this.ready = false;
        this.disconnecting = false;
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
        this.hub.client.typingReceived = function (padid, mate) {
            _this.typingReceived(padid, mate);
        };
        this.hub.client.mateOnline = function (mate) {
            _this.mateOnline(mate);
        };
        this.hub.client.mateOffline = function (mate) {
            _this.mateOffline(mate);
        };

        $.connection.hub.disconnected(function () {
            if (!_this.disconnecting) {
                _this.lostConnection();
            }
        });
    }
    PadHub.prototype.connect = function () {
        var _this = this;
        $.connection.hub.start().done(function () {
            _this.ready = true;
        });
    };
    PadHub.prototype.disconnect = function () {
        this.disconnecting = true;
        $.connection.hub.stop();
        this.disconnecting = false;
    };

    PadHub.prototype.lostConnection = function (retry) {
        var _this = this;
        if (retry === undefined)
            retry = false;
        if (!retry) {
            Progress.show();
        }
        console.log("Lost connection to server. Attempting reconnect...");
        setTimeout(function () {
            $.connection.hub.start().done(function () {
                _this.reconnected();
            }).fail(function () {
                _this.lostConnection(true);
            });
        }, 5000); // Restart connection after 5 seconds.
    };

    PadHub.prototype.reconnected = function () {
        console.log("Reconnected successfully.");
        Progress.hide();
        if (this.currentPadPage) {
            this.currentPadPage.reconnected();
        }
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

    PadHub.prototype.typingReceived = function (padid, mate) {
        if (this.currentPadPage) {
            this.currentPadPage.mateTyping(padid, mate);
        } else {
            console.log("Typing from '" + mate.mateId + "'");
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
    PadHub.prototype.mateOnline = function (mate) {
        console.log("MATE ONLINE");
        if (this.currentPadPage) {
            this.currentPadPage.mateOnline(mate);
        }
    };
    PadHub.prototype.mateOffline = function (mate) {
        console.log("MATE OFFLINE");
        if (this.currentPadPage) {
            this.currentPadPage.mateOffine(mate);
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

    PadHub.prototype.typing = function (padid) {
        this.hub.server.typing(padid);
    };

    PadHub.prototype.refreshGroups = function () {
        this.hub.server.refreshGroups();
    };
    return PadHub;
})();
//# sourceMappingURL=padhub.js.map
