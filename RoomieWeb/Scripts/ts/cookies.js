var Cookies = (function () {
    function Cookies() {
    }
    Cookies.set_cookie = function (name, value, expires) {
        var cookie_string = name + "=" + encodeURI(value);
        if (expires) {
            cookie_string += "; expires=" + expires.toUTCString();
        }
        document.cookie = cookie_string;
    };
    Cookies.delete_cookie = function (name) {
        var cookie_date = new Date();
        cookie_date.setTime(cookie_date.getTime() - 1);
        document.cookie = name += "=; expires=" + cookie_date.toUTCString();
    };
    Cookies.get_cookie = function (name) {
        var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
        if (results) {
            return (decodeURI(results[2]));
        } else {
            return null;
        }
    };
    return Cookies;
})();
//# sourceMappingURL=cookies.js.map
