import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';

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
  ) {
    if (!process.env.AUTH_SALT || !process.env.AUTH_SALT.startsWith('$2b$')) {
      // checking if the provided salt exists and starts with the bcrypt magic.
      console.error('Invalid salt provided, exiting.');
      process.exit(1);
    }
  }

  /**
   * Registers a user.
   * @param {string} email The users email.
   * @param {string} password The users password.
   * @returns {boolean} Value of success.
   */
  async register(email: string, password: string) {
    if (await this.userRepository.findOne({ where: { email: email } })) {
      return false; // exists.
    }
    const digest = await bcrypt.hash(password, process.env.AUTH_SALT);
    const record = this.userRepository.create({
      email: email,
      passwordDigest: digest,
    });
    await this.userRepository.save(record);
    return true;
  }

  /**
   * Attempts to log in a user given the provided information.
   * @param {string} email The users email.
   * @param {string} password The users password.
   * @returns
   */
  async login(email: string, password: string) {
    const userRecord = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userRecord) return false; // doesn't exist

    const valid = await bcrypt.compare(password, userRecord.passwordDigest);
    if (!valid) return false;

    const token = crypto.randomBytes(32).toString('hex');
    const session = this.sessionRepository.create({
      userID: userRecord.id,
      token: token,
    });
    await this.sessionRepository.save(session);
    return token;
  }
}
