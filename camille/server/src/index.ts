import { Hono } from "hono";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import api_analysis from "./apis/analysis";
import api_conv from "./apis/conversation";
import api_mood from "./apis/mood";
import api_profile from "./apis/profile";
import {
	getAllConversations,
	postConversation,
} from "./models/conversation-model";
import { startWebRTCSession } from "./startWebRTCSession";

const app = new Hono();

app.get("/", (c) => {
	return c.text("Hello Hono!");
});
app.use(prettyJSON());
app.notFound((c) => c.json({ message: "Not Found", ok: false }, 404));

app.use("*", cors());

app.route("/api-profile", api_profile);
app.route("/api-analysis", api_analysis);
app.route("/api-conversation", api_conv);
app.route("/api-mood", api_mood);

// 1. Alloy
// 2. Ballad (comique)
// 3. Coral (trop enjouée)
// 4.

// Get a WebRTC token to start a realtime session
app.post("/start-webrtc-sesssion", async (context) => {
	const body = await context.req.json();
	const response = await startWebRTCSession(body);
	return context.json(response);
});

app.get("/conversation", async (c) => {
	const conversation = await getAllConversations();
	return c.json({ conversation: conversation }, 200);
});

app.post("/conversation", async (c) => {
	console.log("Conversation!!!!");
	const { sentence, speakerId } = await c.req.json();

	if (!sentence || !speakerId) {
		return c.json({ error: "Missing required fields" }, 400);
	}

	const analysis = await postConversation({
		sentence,
		speakerId,
	});

	if (analysis) {
		return c.json(analysis, 201);
	}
	return c.json({ error: "Failed to create conversation" }, 500);
});

export default app;
