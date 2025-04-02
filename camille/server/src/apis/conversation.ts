import { Hono } from "hono";
import { cors } from "hono/cors";
import {
	getAllConversations,
	postConversation,
} from "../models/conversation-model";

type Bindings = {
	USERNAME: string;
	PASSWORD: string;
};

const api_conv = new Hono<{ Bindings: Bindings }>();
api_conv.use("/conversation/*", cors());

api_conv.get("/conversation", async (c) => {
	const conversation = await getAllConversations();
	return c.json({ conversation: conversation }, 200);
});

api_conv.post("/conversation", async (c) => {
	console.log("Conversation!!!!");
	const { sentence, speakerId } = await c.req.json();

	if (!sentence || !speakerId) {
		return c.json({ error: "Missing required fields" }, 400);
	}

	const newConversation = await postConversation({
		sentence,
		speakerId,
	});

	if (newConversation) {
		return c.json({ conversation: newConversation }, 201);
	}
	return c.json({ error: "Failed to create conversation" }, 500);
});

export default api_conv;
