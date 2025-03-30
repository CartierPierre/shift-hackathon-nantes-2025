import { PUBLIC_API_URL } from "$env/static/public";
import type { StartWebRTCSessionBody } from "@camille/server/startWebRTCSession";

export const startWebRTCSession = async (
	options: StartWebRTCSessionBody = {}
) => {
	const response = await fetch(`${PUBLIC_API_URL}/start-webrtc-sesssion`, {
		method: "POST",
		body: JSON.stringify(options),
	});
	const data = await response.json();
	console.log(data);
	return data;
};
