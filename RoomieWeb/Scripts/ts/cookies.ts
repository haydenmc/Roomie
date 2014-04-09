class Cookies {
	public static set_cookie(name: string, value: string, expires?: Date): void {
		var cookie_string = name + "=" + encodeURI(value);
		if (expires) {
			cookie_string += "; expires=" + expires.toUTCString();
		}
		document.cookie = cookie_string;
	}
	public static delete_cookie(name: string): void
	{
		var cookie_date = new Date();  // current date & time
		cookie_date.setTime(cookie_date.getTime() - 1);
		document.cookie = name += "=; expires=" + cookie_date.toUTCString();
	}
	public static get_cookie(name: string): string
	{
		var results = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
		if (results) {
			return (decodeURI(results[2]));
		} else {
			return null;
		}
	}
} 