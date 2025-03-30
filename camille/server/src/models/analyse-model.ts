import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAnalysis = async () => {
  try {
    const analysis = await prisma.analysis.findMany({
      include: {
        conversation: true, // Inclut les détails de la conversation
        consumes: {
          include: {
            substance: true, // Inclut les détails des substances consommées
          },
        },
      },
    });

    console.log('All fetched:', analysis);
    return analysis;
  } catch (error) {
    console.error('Error fetching analysis:', error);
    return null;
  }
};

  
export const postAnalysis = async ({
  sentence,
  mood,
  conversationId,
  consumes = [], // Par défaut, une liste vide
}: {
  sentence: string;
  mood: number;
  conversationId: number;
  consumes?: {
    recreative: boolean;
    medicine: boolean;
    substance: string;
  }[]; // Liste des substances consommées
}) => {
  try {
    // Étape 1: Créer les substances et récupérer leurs IDs
    const createdSubstances = await Promise.all(
      consumes.map(async (consume) => {
        const substance = await prisma.substance.create({
          data: { 
            substance: consume.substance,
            recreative: consume.recreative,
            medicine: consume.medicine,
            },
        });
        return { ...consume, substanceId: substance.id };
      })
    );

    // Étape 2: Créer l'analyse et récupérer son ID
    const newAnalysis = await prisma.analysis.create({
      data: {
        sentence,
        mood,
        createAt: new Date(),
        conversationId, // 🔹 On utilise directement l'ID de la conversation
      },
    });

    // Étape 3: Utiliser les IDs récupérés pour créer les relations dans la table Consume
    await prisma.consume.createMany({
      data: createdSubstances.map((consume) => ({
        substanceId: consume.substanceId,
        analysisId: newAnalysis.id,
      })),
    });

    // Inclure les détails de la conversation et des substances consommées dans le retour
    const analysisWithDetails = await prisma.analysis.findUnique({
      where: { id: newAnalysis.id },
      include: {
        conversation: true,
        consumes: {
          include: {
            substance: true,
          },
        },
      },
    });

    console.log('New analysis created:', analysisWithDetails);
    return analysisWithDetails;
  } catch (error) {
    console.error('Error creating analysis:', error);
    return null;
  }
};