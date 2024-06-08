import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      console.log('Decoded token');
      const token = authHeader.split(' ')[1];
      try {
        console.log('Decoded token');
        const decoded = this.jwtService.verify(token, {
          secret: process.env.JWT_SECRET || 'your_jwt_secret_key',
        });
        res.locals.user = decoded;
      } catch (err) {
        console.error('Invalid token', err);
      }
    } else {
      console.error('No token provided');
      return res.status(401).json({ message: 'Unauthorized' });
    }
    next();
  }
}
