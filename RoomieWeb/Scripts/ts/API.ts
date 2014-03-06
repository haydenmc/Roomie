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
	public static put(url: string, data: any, success: Function, error: Function) {
		$.ajax("/api/" + url, {
			type: "PUT",
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
	public static delete(url: string, success: Function, error: Function) {
		$.ajax("/api/" + url, {
			type: "DELETE",
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

	public static padmates(padId: string, success: Function, error: Function) {
		API.get("Pad/" + padId + "/Mates", success, error);
	}

	public static newpad(StreetAddress: string, ZipCode: string,success:Function, error:Function) {
		API.post("Pad", {StreetAddress: StreetAddress, ZipCode: ZipCode}, success, error);
	}

	public static padmessages(padId: string, success: Function, error: Function) {
		API.get("Pad/" + padId + "/Messages", success, error);
	}

	/* Invite API */
	public static invites(success: Function, error: Function) {
		API.get("Invites", success, error);
	}

	public static sendInvite(padId: string, userEmail: string, success: Function, error: Function) {
		API.post("Invites", { RecipientEmail: userEmail, PadId: padId }, success, error);
	}

	public static acceptInvite(inviteId: string, success: Function, error: Function) {
		API.put("Invites/" + inviteId + "/Accept", {}, success, error);
	}

	public static declineInvite(inviteId: string, success: Function, error: Function) {
		API.delete("Invites/" + inviteId, success, error);
	}
} 