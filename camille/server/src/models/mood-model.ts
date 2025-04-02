import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMoodByDay = async () => {
  try {
    // Récupérer toutes les analyses avec la date de création
    const analyses = await prisma.analysis.findMany({
      orderBy: {
        createAt: 'desc',
      },
    });

    // Utiliser un objet pour regrouper les analyses par date
    const moodByDay: any = {};

    analyses.forEach((analysis) => {
      const date = analysis.createAt.toISOString().split('T')[0]; // Extraire la date sans l'heure
      if (!moodByDay[date]) {
        moodByDay[date] = { totalMood: 0, count: 0 };
      }
      moodByDay[date].totalMood += analysis.mood;
      moodByDay[date].count += 1;
    });

    // Calculer la moyenne pour chaque jour
    const averageMoodByDay:any = {};
    for (const date in moodByDay) {
      averageMoodByDay[date] = moodByDay[date].totalMood / moodByDay[date].count;
    }

    console.log('Average mood by day:', averageMoodByDay);
    return averageMoodByDay;
  } catch (error) {
    console.error('Error fetching mood by day:', error);
    return null;
  }
};
