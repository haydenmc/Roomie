var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var InviteDialog = (function (_super) {
    __extends(InviteDialog, _super);
    function InviteDialog(pad_id) {
        var _this = this;
        _super.call(this, "invite");
        this.submitting = false;
        this.padId = pad_id;
        var content = (this.page_element.getElementsByClassName("content")[0]);
        content.innerHTML = '<form><p>Type the e-mail address of the room mate you\'d like to add.<br />' + 'If they already have an account, they will receive an invite to your pad.<br />' + 'Otherwise, they will be sent an e-mail with instructions on how to join.</p>' + '<input type="email" placeholder="room mate e-mail" name="email" />';

        this.page_element.getElementsByTagName("form")[0].addEventListener("submit", function (evt) {
            evt.preventDefault();
            _this.invite();
        });

        this.addAction("invite", function () {
            _this.invite();
        });
        this.addAction("cancel", function () {
            _this.hide();
        });
    }
    InviteDialog.prototype.invite = function () {
        var _this = this;
        if (this.submitting) {
            return;
        }
        this.submitting = true;
        Progress.show();
        var email = this.page_element.getElementsByTagName("input")[0].value;
        API.sendInvite(this.padId, email, function () {
            _this.invite_success();
        }, function () {
            _this.invite_failure();
        });

        // Disable text entry
        this.page_element.getElementsByTagName("input")[0].disabled = true;
    };

    InviteDialog.prototype.invite_success = function () {
        this.submitting = false;
        Progress.hide();
        var d = new Dialog("invite sent");
        d.setContent("<p>Your invite has been sent successfully!</p>");
        d.addAction("close", function () {
            (function (dialog) {
                dialog.hide();
            })(d);
        });
        d.show();
        this.hide();
    };

    InviteDialog.prototype.invite_failure = function () {
        this.submitting = false;
        Progress.hide();
        this.page_element.getElementsByTagName("input")[0].disabled = false;
        var d = new Dialog("oops");
        d.setContent("<p>Your invite could not be delivered.<br />Please check the address and try again.<br />The invite recipient may have already received an invite to this pad.</p>");
        d.addAction("close", function () {
            (function (dialog) {
                dialog.hide();
            })(d);
        });
        d.show();
    };
    return InviteDialog;
})(Dialog);
//# sourceMappingURL=invitedialog.js.map
