import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

/**
 * Job: Handles authentication; session management, logins, etc.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(email: string, password: string) {
    // stub
    return;
  }

  async login(email: string, password: string) {
    // stub
    return;
  }
}
