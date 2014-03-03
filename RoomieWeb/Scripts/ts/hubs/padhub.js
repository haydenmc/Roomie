var PadHub = (function () {
    function PadHub() {
        var _this = this;
        this.hub = $.connection.padHub;
        this.ready = false;
        this.hub.client.messageReceived = function (userid, padid, body) {
            _this.messageReceived(userid, padid, body);
        };
        this.hub.client.systemMessage = function (body) {
            _this.systemMessage(body);
        };
        $.connection.hub.start().done(function () {
            _this.hub.server.joinPads(Application.auth_token);
            _this.ready = true;
        });
    }
    /* Client-side methods*/
    PadHub.prototype.messageReceived = function (userid, padid, body) {
        console.log("Message from '" + userid + "': " + body);
    };

    PadHub.prototype.systemMessage = function (body) {
        console.log("System message from server: " + body);
    };

    /* Server-side methods */
    PadHub.prototype.sendMessage = function (padid, body) {
        this.hub.server.sendMessage(padid, body);
    };
    return PadHub;
})();
//# sourceMappingURL=padhub.js.map
