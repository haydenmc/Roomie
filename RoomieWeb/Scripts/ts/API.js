var API = (function () {
    function API() {
    }
    API.get = function (url, success, error, retry) {
        if (!retry) {
            retry = 0;
        }
        Application.instance.authentication.validate(function () {
            $.ajax("/api/" + url, {
                type: "GET",
                dataType: "JSON",
                headers: { "Authorization": "Bearer " + Application.instance.authentication.get_access_token() },
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error();
                }
            });
        }, function () {
            if (retry > API.RETRY_COUNT) {
                Application.instance.logOut();
            } else {
                setTimeout(function () {
                    API.get(url, success, error, retry + 1);
                }, 5000);
            }
        });
    };
    API.post = function (url, data, success, error, retry) {
        if (!retry) {
            retry = 0;
        }
        Application.instance.authentication.validate(function () {
            $.ajax("/api/" + url, {
                type: "POST",
                dataType: "JSON",
                data: data,
                headers: { "Authorization": "Bearer " + Application.instance.authentication.get_access_token() },
                success: function (d) {
                    success(d);
                },
                error: function () {
                    error();
                }
            });
        }, function () {
            if (retry > API.RETRY_COUNT) {
                Application.instance.logOut();
            } else {
                setTimeout(function () {
                    API.post(url, data, success, error, retry + 1);
                }, 5000);
            }
        });
    };
    API.put = function (url, data, success, error, retry) {
        if (!retry) {
            retry = 0;
        }
        Application.instance.authentication.validate(function () {
            $.ajax("/api/" + url, {
                type: "PUT",
                dataType: "JSON",
                data: data,
                headers: { "Authorization": "Bearer " + Application.instance.authentication.get_access_token() },
                success: function (d) {
                    success(d);
                },
                error: function () {
                    error();
                }
            });
        }, function () {
            if (retry > API.RETRY_COUNT) {
                Application.instance.logOut();
            } else {
                setTimeout(function () {
                    API.put(url, data, success, error, retry + 1);
                }, 5000);
            }
        });
    };
    API.delete = function (url, success, error, retry) {
        if (!retry) {
            retry = 0;
        }
        Application.instance.authentication.validate(function () {
            $.ajax("/api/" + url, {
                type: "DELETE",
                dataType: "JSON",
                headers: { "Authorization": "Bearer " + Application.instance.authentication.get_access_token() },
                success: function (data) {
                    success(data);
                },
                error: function () {
                    error();
                }
            });
        }, function () {
            if (retry > API.RETRY_COUNT) {
                Application.instance.logOut();
            } else {
                setTimeout(function () {
                    API.delete(url, success, error, retry + 1);
                }, 5000);
            }
        });
    };

    /* AUTHENTICATION */
    API.token = function (username, password, success, error) {
        $.ajax("/Token", {
            type: "POST",
            dataType: "JSON",
            data: { grant_type: "password", username: username, password: password },
            success: function (data) {
                success(data);
            },
            error: function () {
                error();
            }
        });
    };

    API.refreshtoken = function (token, email, success, error) {
        $.ajax("/Token", {
            type: "POST",
            dataType: "JSON",
            data: { grant_type: "refresh_token", client_id: email, refresh_token: token },
            success: function (data) {
                success(data);
            },
            error: function () {
                error();
            }
        });
    };

    // This doesn't require AUTH, so we have a different POST call...
    API.register = function (email, displayname, password, confirmpassword, success, error) {
        $.ajax("/api/Account/Register", {
            type: "POST",
            dataType: "JSON",
            data: {
                Email: email,
                DisplayName: displayname,
                Password: password,
                ConfirmPassword: confirmpassword
            },
            success: function (d) {
                success(d);
            },
            error: function () {
                error();
            }
        });
    };

    /* PAD API */
    API.pads = function (success, error) {
        API.get("Pad", success, error);
    };

    API.padmates = function (padId, success, error) {
        API.get("Pad/" + padId + "/Mates", success, error);
    };

    API.newpad = function (StreetAddress, ZipCode, success, error) {
        API.post("Pad", { StreetAddress: StreetAddress, ZipCode: ZipCode }, success, error);
    };

    API.padmessages = function (padId, success, error) {
        API.get("Pad/" + padId + "/Messages", success, error);
    };

    /* Invite API */
    API.invites = function (success, error) {
        API.get("Invites", success, error);
    };

    API.sendInvite = function (padId, userEmail, success, error) {
        API.post("Invites", { RecipientEmail: userEmail, PadId: padId }, success, error);
    };

    API.acceptInvite = function (inviteId, success, error) {
        API.put("Invites/" + inviteId + "/Accept", {}, success, error);
    };

    API.declineInvite = function (inviteId, success, error) {
        API.delete("Invites/" + inviteId, success, error);
    };
    API.RETRY_COUNT = 3;
    return API;
})();
//# sourceMappingURL=API.js.map
