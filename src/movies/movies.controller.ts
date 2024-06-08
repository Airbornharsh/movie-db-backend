import { Body, Controller, Get, Post, Query, Response } from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAllMovies(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.moviesService.getAllMovies(page, limit);
  }

  @Get('genre')
  async getMoviesByGenre(
    @Query('genre') genre: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return await this.moviesService.getMoviesByGenre(genre, page, limit);
  }

  @Post('rate')
  async rateMovie(
    @Body('movieId') movieId: number,
    @Body('score') score: number,
    @Response() res,
  ) {
    if (score < 1 || score > 5) {
      return res.status(400).json({ message: 'Invalid score' });
    }
    const response = await this.moviesService.rateMovie(
      res.locals.user.sub,
      movieId,
      score,
    );
    return res.status(201).json({
      message: 'Rating added successfully',
      rate: {
        userId: response.userId,
        movieId: response.movieId,
        score: response.score,
      },
    });
  }

  @Get('sorted-by-rating')
  async getMoviesSortedByRating(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.moviesService.getMoviesSortedByRating(page, limit);
  }
}
