import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getLastProfile = async () => {
    try {
      const lastProfile = await prisma.profile.findFirst({
        orderBy: {
          id: 'desc',
        },
      });
      console.log('Last profile fetched:', lastProfile);
      return lastProfile;
    } catch (error) {
      console.error('Error fetching last profile:', error);
      return null;
    }
  };

export const postProfile = async ({
    name,
    lastname,
    birthdate,
    culture,
    follow,
  }: {
    name: string;
    lastname: string;
    birthdate: Date;
    culture: string;
    follow?: boolean;
  }) => {
    try {
      const newProfile = await prisma.profile.create({
        data: {
          name,
          lastname,
          birthDate: birthdate,
          culture,
          follow: follow ?? false,
        },
      });
      console.log('New profile created:', newProfile);
      return newProfile;
    } catch (error) {
      console.error('Error creating profile:', error);
      return null;
    }
  };