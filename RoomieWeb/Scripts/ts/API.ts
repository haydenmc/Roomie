class API {
	public static get(url: string, success: Function, error: Function) {
		$.ajax("/api/"+url, {
			type: "GET",
			dataType: "JSON",
			headers: { "Authorization": "Bearer " + Application.auth_token },
			success: (data) => {
				success(data);
			},
			error: () => {
				error();
			}
		});
	}
	public static post(url: string, data: any, success: Function, error: Function) {
		$.ajax("/api/" + url, {
			type: "POST",
			dataType: "JSON",
			data: data,
			headers: { "Authorization": "Bearer " + Application.auth_token },
			success: (d) => {
				success(d);
			},
			error: () => {
				error();
			}
		});
	}
	/* AUTHENTICATION */
	public static token(username: string, password: string, success: Function, error: Function) {
		$.ajax("/Token", {
			type: "POST",
			dataType: "JSON",
			data: { grant_type: "password", username: username, password: password },
			success: (data) => {
				success(data);
			},
			error: () => {
				error();
			}
		});
	}

	public static register(email: string,displayname: string, password: string, confirmpassword: string, success: Function, error: Function) {
		API.post("Account/Register", {
			Email: email,
			DisplayName: displayname,
			Password: password,
			ConfirmPassword: confirmpassword
		}, success, error);
	}

	/* PAD API */
	public static pads(success:Function, error:Function) {
		API.get("Pad", success, error);
	}

	public static newpad(StreetAddress: string, ZipCode: string,success:Function, error:Function) {
		API.post("Pad", {StreetAddress: StreetAddress, ZipCode: ZipCode}, success, error);
	}
} 