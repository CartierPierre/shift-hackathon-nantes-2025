import { env } from "bun";
import OpenAI from "openai";
import type { Analysis } from "../models/conversation-model";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function analyse(
	question: string,
	answer: string
): Promise<Analysis> {
	const response = await openai.responses.create({
		model: "gpt-4o-2024-08-06",
		input: [
			{
				role: "system",
				content:
					"Tu es un assistant spécialisé dans l'analyse de l'humeur. Analyse la réponse de l'utilisateur et retourne un JSON avec deux clés :\n- 'analyse': une phrase qui décrit l'humeur.\n- 'mood': un nombre entre 1 et 100 représentant l'humeur.\n- 'thinkingAboutSuicide': un boolean qui doit être à true si la personne parle de se suicider ou de se tuer.",
			},
			{ role: "user", content: answer },
		],
		temperature: 0,
		text: {
			format: {
				type: "json_schema",
				name: "ai_analyse",
				schema: {
					type: "object",
					properties: {
						analyse: {
							type: "string",
						},
						mood: {
							type: "number",
						},
						thinkingAboutSuicide: {
							type: "boolean",
						},
						substences: {
							type: "array",
							items: {
								type: "object",
								properties: {
									recreative: { type: "boolean" },
									medicine: { type: "boolean" },
									substance: { type: "string" },
								},
								additionalProperties: false,
								required: ["recreative", "medicine", "substance"],
							},
						},
					},
					required: ["analyse", "mood", "thinkingAboutSuicide", "substences"],
					additionalProperties: false,
				},
			},
		},
	});

	try {
		const result = JSON.parse(response.output_text);
		console.log("Analyse de l'humeur :", result);
		return result;
	} catch (error) {
		console.error("Erreur de parsing JSON :", error);
		return {
			analyse: "",
			mood: 0,
			thinkingAboutSuicide: false,
			substences: [],
		};
	}
}
