import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Response,
} from '@nestjs/common';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  async getAllMovies(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.moviesService.getAllMovies(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Get('genre')
  async getMoviesByGenre(
    @Query('genre') genre: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return await this.moviesService.getMoviesByGenre(
      genre,
      parseInt(page),
      parseInt(limit),
    );
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
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.moviesService.getMoviesSortedByRating(
      parseInt(page),
      parseInt(limit),
    );
  }

  @Post()
  async createMovie(
    @Body()
    createMovieDto: {
      title: string;
      releaseDate: Date;
      description?: string;
      genre: string;
    },
    @Response() res,
  ) {
    if (res.locals.user.admin === false) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const movie = await this.moviesService.createMovie(createMovieDto);
    return res.status(201).json(movie);
  }

  @Put(':id')
  async updateMovie(
    @Param('id') id: string,
    @Body()
    updateMovieDto: {
      title?: string;
      releaseDate?: Date;
      description?: string;
      genre?: string;
    },
    @Response() res,
  ) {
    if (res.locals.user.admin === false) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const updatedMovie = await this.moviesService.updateMovie(
      parseInt(id),
      updateMovieDto,
    );
    return res.status(200).json(updatedMovie);
  }
}
