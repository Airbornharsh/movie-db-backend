import { PrismaClient, $Enums } from '@prisma/client';
import moviesData from './movies';

const prisma = new PrismaClient();

interface MOVIE {
  title: string;
  description: string;
  releaseDate: Date;
  genre: $Enums.Genre;
}

async function main() {
  try {
    await prisma.movie.createMany({
      data: moviesData as MOVIE[],
    });
    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
