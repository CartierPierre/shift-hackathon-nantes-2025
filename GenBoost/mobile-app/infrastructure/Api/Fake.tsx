import { Api } from "../../domain/Api";

const fakeRhese = [
  "L'histoire de la Terre commence",
  "voici plus de 4,5 milliards d'années.",
  "Au centre de la Terre,",
  "un noyau métallique de fer et de nickel",
  "peut atteindre 5 500 degrés.",
  "Il est entouré d'un manteau de roches,",
  "plus ou moins fondues.",
  "En surface, l'écorce (ou croute) terrestre",
  "n'a que 5 à 70 km d'épaisseur,",
  "selon les endroits.",
];

const fakeNamedEntity = [{
    "text": "Dans la grande cité de [Valmont](ville), le vieux [duc](titre de noblesse) de [Montreval](nom de famille) gouvernait avec sagesse. Mais [Montreval](nom de famille), bien que respecté, avait un rival : le jeune et ambitieux [marquis](titre de noblesse). Ce dernier, connu sous le nom dÆ[Henri de Montreval](nom complet), n'était autre que son propre neveu.\n\nUn jour, le [duc](titre de noblesse) convoqua son héritier. [Henri](prénom) vint le voir, mais [Montreval](nom de famille), soucieux, hésitait à parler. Il savait que son successeur, aussi brillant soit-il, n'était pas toujours fiable. Il lui confia néanmoins une mission.\n\nPlus tard, lorsqu'on interrogea [Montreval](nom de famille) sur sa décision, il déclara :\nù Je lui fais confiance.\nMais personne ne savait s'il parlait du [duc](titre de noblesse) ou du [marquis](titre de noblesse).\n\n[Henri](prénom), lui, avait compris les paroles de [Montreval](nom de famille) comme un défi. Il retourna dans la grande cité, où tout le monde parlait de [Montreval](nom de famille) et de son avenir incertain. Certains pensaient qu'il ne tiendrait plus longtemps, dÆautres croyaient qu'il saurait encore gouverner.\n\nQuand il arriva, il fut accueilli par son oncle, qui lui demanda :\nù Es-tu prêt ?\nù Je le suis, répondit-il.\n\nMais à qui répondait-il ?",
    "explanations": {
        "ville": "Un lieu où vivent beaucoup de personnes.",
        "titre de noblesse": "Un titre donné à une personne importante dans une société noble.",
        "nom de famille": "Le nom qui est partagé par les membres d'une même famille.",
        "prénom": "Le nom personnel qui est donné à une personne à la naissance.",
        "nom complet": "Le nom complet d'une personne, incluant le prénom et le nom de famille."
    }
}]

export const fakeApi: Api = {
  getRhese: (text: string) => Promise.resolve(fakeRhese),
  getNamedEntity: (text: string) => Promise.resolve(fakeNamedEntity),
  getBoostedParagraph: (text: string) => Promise.resolve(fakeRhese),
};
