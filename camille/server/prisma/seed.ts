import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {

  // Insérez les conversations
  await prisma.conversation.createMany({
    data: [
      {
        sentence: "Hey comment ça va ? Moi pas trop, je m'appelle thomas, j'ai 18 ans, je suis en prépa et j'ai très mal vécu ma dernière colle, j'ai l'impression d'être une merde.",
        createAt: new Date('2023-10-01T12:00:00.000Z'),
        updateAt: new Date('2023-10-01T12:00:00.000Z'),
        speakerId: 2,
      },
      {
        sentence: "Hey Thomas 💙 Merci d’avoir pris le temps d’écrire… Vraiment. C’est déjà un truc de ouf de poser des mots sur ce qu’on ressent, surtout quand ça fait mal comme ça. Ta phrase, \"j’ai l’impression d’être une merde\", elle me serre le cœur. J’entends que t’as pris un coup, que t’as été hyper dur avec toi-même après cette colle. Mais t’es pas une merde, t’es un humain. Un humain en prépa, en plus — aka l’un des parcours les plus exigeants et épuisants qui soient. Tu veux m’en dire un peu plus sur ce qui s’est passé pendant cette colle ? C’était quoi qui t’a tant chamboulé ? Est-ce que c’est le regard du prof, ce que t’as dit, ce que t’as pas su dire ? 💬 T’es pas seul, ok ? Je suis là pour toi, on va dénouer ça petit à petit. 🌱",
        createAt: new Date('2023-10-01T12:05:00.000Z'),
        updateAt: new Date('2023-10-01T12:05:00.000Z'),
        speakerId: 1,
      },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
