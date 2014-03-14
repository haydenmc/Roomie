var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MeDialog = (function (_super) {
    __extends(MeDialog, _super);
    function MeDialog() {
        var _this = this;
        _super.call(this, "me");

        this.addAction("log out", function () {
            _this.logout();
        });
        this.addAction("close", function () {
            _this.hide();
        });
    }
    MeDialog.prototype.logout = function () {
        Application.instance.logOut();
        this.hide();
    };
    return MeDialog;
})(Dialog);
//# sourceMappingURL=medialog.js.map
