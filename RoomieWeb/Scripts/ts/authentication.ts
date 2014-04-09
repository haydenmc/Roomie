/**
 * This class manages client authentication
 * It will NOT under any circumstances store user credentials
 * outside of tokens for identifying and renewing auth status.
 */
class Authentication {
	private access_token: string;
	private refresh_token: string;
	private expire_time: Date;
	private email_address: string;
	private mate_id: string;
	private display_name: string;

	constructor() {
		// Check to see if we have auth information in our cookies...
		this.access_token = Cookies.get_cookie("auth_access_token");
		this.refresh_token = Cookies.get_cookie("auth_refresh_token");
		try {
			this.expire_time = new Date(Cookies.get_cookie("auth_expire_time"));
		} catch (ex)
		{
			// Invalid expire time? Don't use these cookies.
			this.logout();
			return;
		}
		this.email_address = Cookies.get_cookie("auth_email_address");
		this.mate_id = Cookies.get_cookie("auth_mate_id");
		this.display_name = Cookies.get_cookie("auth_display_name");

		// If any of these fields aren't set... don't use these cookies
		if (this.access_token == null || this.access_token.length <= 0
			|| this.refresh_token == null || this.refresh_token.length <= 0
			|| this.email_address == null || this.email_address.length <= 0
			|| this.mate_id == null || this.mate_id.length <= 0
			|| this.display_name == null || this.display_name.length <= 0) {
			this.logout(); // Reset all values to null
		}
	}

	public authenticate(email: string, password: string, success?: Function, failure?: Function): void {
		API.token(email, password, (data) => {
			this.access_token = data.access_token;
			this.refresh_token = data.refresh_token;
			this.email_address = email;
			this.mate_id = data.MateId;
			this.display_name = data.DisplayName;
			this.expire_time = new Date(data[".expires"]);
			this.save_cookies();
			if (success) {
				success();
			}
		}, () => {
			if (failure) {
				failure();
			}
		});
	}

	public refresh(success?: Function, failure?: Function): void {
		API.refreshtoken(this.refresh_token, this.email_address, (data) => {
			this.access_token = data.access_token;
			this.refresh_token = data.refresh_token;
			this.mate_id = data.MateId;
			this.display_name = data.DisplayName;
			this.expire_time = new Date(data[".expires"]);
			this.save_cookies();
			if (success) {
				success();
			}
		}, () => {
			if (failure) {
				failure();
			}
		});
	}

	private save_cookies(): void {
		var expireDate: Date = new Date();
		expireDate.setDate(expireDate.getDate() + 7);
		Cookies.set_cookie("auth_access_token", this.access_token, expireDate);
		Cookies.set_cookie("auth_refresh_token", this.refresh_token, expireDate);
		Cookies.set_cookie("auth_expire_time", this.expire_time.toString(), expireDate);
		Cookies.set_cookie("auth_email_address", this.email_address, expireDate);
		Cookies.set_cookie("auth_mate_id", this.mate_id, expireDate);
		Cookies.set_cookie("auth_display_name", this.display_name, expireDate);
	}

	public has_expired(): boolean {
		if (this.expire_time === undefined) {
			return true;
		}
		return !(this.expire_time.getTime() - (new Date()).getTime() > 0);
	}

	/***
	 * This function is to be used to validate that our session is valid and authenticated.
	 * It's asynchronous, so pass in a valid callback to execute if the session is validated
	 */
	public validate(valid: Function, invalid: Function) {
		// TODO: QUEUE refresh requests, validate all when response is received.
		if (!this.refresh_token || this.refresh_token.length <= 0) {
			// Don't have a refresh token?
			invalid();
		} else if (this.has_expired()) {
			console.log("Session expired - rewewing...");
			// Session expired? Refresh it, then see if it's valid
			this.refresh(valid, invalid);
		} else {
			// We have a token and it hasn't expired - valid
			// TODO: Actually check against the server.
			valid();
		}
	}

	public get_display_name(): string {
		return this.display_name;
	}

	public get_mate_id(): string {
		return this.mate_id;
	}

	public get_access_token(): string {
		return this.access_token;
	}

	public logout(): void {
		// Unset all authentication values
		this.access_token = null;
		this.refresh_token = null;
		this.email_address = null;
		this.mate_id = null;
		this.display_name = null;
		this.expire_time = null;

		Cookies.delete_cookie("auth_access_token");
		Cookies.delete_cookie("auth_refresh_token");
		Cookies.delete_cookie("auth_expire_time");
		Cookies.delete_cookie("auth_email_address");
		Cookies.delete_cookie("auth_mate_id");
		Cookies.delete_cookie("auth_display_name");

		//Cookies.delete_cookie(".AspNet.Cookies"); // Delete ASP Identity Cookies, too.
		//TODO: ASPNET AUTH COOKIE IS NEVER REMOVED! This has to be done from the server side.
	}
} 