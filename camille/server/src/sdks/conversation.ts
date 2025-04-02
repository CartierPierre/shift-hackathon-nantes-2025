import { env } from "bun";
import OpenAI from "openai";
import { getAllConversations } from "../models/conversation-model";

const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });

export async function converse(
	answer: string,
	analyse: {
		sentence: string;
		mood: number;
		substences: Array<{
			substance: string;
			recreative: boolean;
			medicine: boolean;
		}>;
	}
) {
	const response = await openai.responses.create({
		model: "gpt-4o-2024-08-06",
		input: [
			{
				role: "system",
				content: `Tu es un assistant qui questionne son utilisateur pour savoir si quelle est son humeur. Reprends la conversation ou elle en était. L'analyse de l'humeur de l'utilisateur est la suivante: ${analyse.sentence} Tu sais que l'humeur de l'utilisateur est de ${analyse.mood}%. A moins de 20% tu dois t'inquiéter d'une humeur potentiellement dépressive. A plus de 80% tu dois t'inquiéter d'une humeur potentiellement euphorique.${analyse.substences
					.map((substance: any) => {
						return `L'utilisateur a consommé ${substance.substance} qui est ${substance.recreative ? "récréatif" : "médical"}.${substance.medicine ? " Un médecin lui a préscrit." : ""}`;
					})
					.join(
						" "
					)}  Voici les derniés échanges de la conversation: ${await getAllConversations()}`,
			},
			{ role: "user", content: answer },
		],
		temperature: 0.7,
	});

	try {
		const result = response.output_text;
		console.log("Réponse à l'utilisateur :", result);
		return result || "Analyse non disponible";
	} catch (error) {
		console.error("Erreur de parsing JSON :", error);
		return "Erreur d'analyse";
	}
}
