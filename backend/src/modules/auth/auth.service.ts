import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';

/**
 * Job: Handles authentication; session management, logins, etc.
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
  ) {}

  async register(email: string, password: string) {
    if (await this.userRepository.findOne({ where: { email: email } })) {
      return false; // exists.
    }
    const record = this.userRepository.create({
      email: email,
      passwordDigest: password, // VERY SUPER TEMPORARY. didn't want to figure out password digestion. shouldn't be super hard though...
    });
    await this.userRepository.save(record);
    return true;
  }

  async login(email: string, password: string) {
    const userRecord = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userRecord) {
      return false; // doesn't exist
    }
    if (password !== userRecord.passwordDigest) {
      return false;
    }

    const token = crypto.randomBytes(32).toString('hex');
    const session = this.sessionRepository.create({
      userID: userRecord.id,
      token: token,
    });
    await this.sessionRepository.save(session);
    return token;
  }
}
