var PadHub = (function () {
    function PadHub() {
        var _this = this;
        this.hub = $.connection.padHub;
        this.ready = false;
        this.hub.client.messageReceived = function (userid, padid, body, time) {
            _this.messageReceived(userid, padid, body, time);
        };
        this.hub.client.systemMessage = function (body) {
            _this.systemMessage(body);
        };
        $.connection.hub.start().done(function () {
            //this.hub.server.joinPads(Application.auth_token); // Should happen automagically.
            _this.ready = true;
        });
    }
    PadHub.prototype.assignMessageReceived = function (f) {
        this.messageReceivedFunction = f;
    };

    /* Client-side methods*/
    PadHub.prototype.messageReceived = function (userid, padid, body, time) {
        if (this.messageReceivedFunction) {
            this.messageReceivedFunction(userid, padid, body, time);
        } else {
            console.log("Message @ " + time + " from '" + userid + "': " + body);
        }
    };

    PadHub.prototype.systemMessage = function (body) {
        console.log("SYSTEM: " + body);
    };

    /* Server-side methods */
    PadHub.prototype.sendMessage = function (padid, body) {
        this.hub.server.sendMessage(padid, body);
    };
    return PadHub;
})();
//# sourceMappingURL=padhub.js.map
