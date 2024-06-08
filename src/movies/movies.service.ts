import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, Movie } from '@prisma/client';

@Injectable()
export class MoviesService {
  constructor(private prisma: PrismaService) {}

  async getAllMovies(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const movies = await this.prisma.movie.findMany({
      skip,
      take: limit,
    });
    const totalMovies = await this.prisma.movie.count();
    return {
      data: movies,
      total: totalMovies,
      page,
      lastPage: Math.ceil(totalMovies / limit),
    };
  }

  async getMoviesByGenre(genre: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    if (!Object.values($Enums.Genre).includes(genre as $Enums.Genre)) {
      throw new Error('Invalid genre');
    }
    const movies = await this.prisma.movie.findMany({
      where: { genre: genre as $Enums.Genre },
      skip,
      take: limit,
    });
    const totalMovies = await this.prisma.movie.count({
      where: { genre: genre as $Enums.Genre },
    });
    return {
      data: movies,
      total: totalMovies,
      page,
      lastPage: Math.ceil(totalMovies / limit),
    };
  }

  async rateMovie(userId: number, movieId: number, score: number) {
    const rate = await this.prisma.rating.upsert({
      where: {
        userId_movieId: {
          userId,
          movieId,
        },
      },
      update: { score },
      create: {
        userId,
        movieId,
        score,
      },
    });
    console.log(rate);
    return rate;
  }

  async getMoviesSortedByRating(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const movies = await this.prisma.$queryRaw`
      SELECT m.*, COALESCE(AVG(r.score), 0) as avgRating
      FROM "Movie" m
      LEFT JOIN "Rating" r ON r."movieId" = m.id
      GROUP BY m.id
      ORDER BY avgRating DESC
      OFFSET ${skip} LIMIT ${limit};
    `;

    const totalMovies = await this.prisma.movie.count();

    return {
      data: movies,
      total: totalMovies,
      page,
      lastPage: Math.ceil(totalMovies / limit),
    };
  }

  async createMovie(data: {
    title: string;
    releaseDate: Date;
    description?: string;
    genre: string;
  }): Promise<Movie> {
    return this.prisma.movie.create({
      data: {
        title: data.title,
        releaseDate: data.releaseDate,
        description: data.description,
        genre: data.genre as $Enums.Genre,
      },
    });
  }

  async updateMovie(
    id: string,
    data: {
      title?: string;
      releaseDate?: Date;
      description?: string;
      genre?: string;
    },
  ): Promise<Movie> {
    const updateData: Partial<Movie> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.releaseDate !== undefined)
      updateData.releaseDate = data.releaseDate;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.genre !== undefined) updateData.genre = data.genre as $Enums.Genre;

    return this.prisma.movie.update({
      where: { id: parseInt(id) },
      data: updateData,
    });
  }
}
