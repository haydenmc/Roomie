var API = (function () {
    function API() {
    }
    API.get = function (url, success, error) {
        $.ajax("/api/" + url, {
            type: "GET",
            dataType: "JSON",
            headers: { "Authorization": "Bearer " + Application.auth_token },
            success: function (data) {
                success(data);
            },
            error: function () {
                error();
            }
        });
    };
    API.post = function (url, data, success, error) {
        $.ajax("/api/" + url, {
            type: "POST",
            dataType: "JSON",
            data: data,
            headers: { "Authorization": "Bearer " + Application.auth_token },
            success: function (d) {
                success(d);
            },
            error: function () {
                error();
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

    API.register = function (email, displayname, password, confirmpassword, success, error) {
        API.post("Account/Register", {
            Email: email,
            DisplayName: displayname,
            Password: password,
            ConfirmPassword: confirmpassword
        }, success, error);
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
    return API;
})();
//# sourceMappingURL=API.js.map
