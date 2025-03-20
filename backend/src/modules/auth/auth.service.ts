import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Faculty } from 'src/entity/faculty.entity';
import { Student } from 'src/entity/student.entity';
import { Session } from 'src/entity/session.entity';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    private jwtService: JwtService,
  ) {}

  // Registration logic is handled between students and faculty.
  async register(email: string, password: string, isFaculty: boolean) {
    if (await this.userRepository.findOne({ where: { email: email } })) {
      throw new Error('User already exists'); // exists.
    }
    const digest = bcrypt.hashSync(
      password,
      bcrypt.genSaltSync(+process.env.BCRYPT_SALT_ROUNDS), // slight hack
    );
    const userRecord = this.userRepository.create({
      email: email,
      password_digest: digest,
    });

    // Attaching the user record to an empty student/faculty record.
    // These will, assumedly, get filled out later.
    if (isFaculty) {
      const facultyRecord = this.facultyRepository.create({});
      await this.facultyRepository.save(facultyRecord);
      userRecord.faculty = facultyRecord;
    } else {
      const studentRecord = this.studentRepository.create({});
      await this.studentRepository.save(studentRecord);
      userRecord.student = studentRecord;
    }
    await this.userRepository.save(userRecord);

    return {
      token: await this.createJWT(userRecord),
      session: await this.createSessionToken(userRecord),
    };
  }

  async login(email: string, password: string) {
    const userRecord = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userRecord) {
      // No user record > user doesn't exist, so throw an exception.
      throw new UnauthorizedException();
    }

    if (await bcrypt.compare(password, userRecord.password_digest)) {
      // The passed in password matches the other, good to go.
      return {
        token: await this.createJWT(userRecord),
        session: await this.createSessionToken(userRecord),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async createJWT(userRecord: User) {
    const payload = { id: userRecord.user_id, email: userRecord.email };
    return await this.jwtService.signAsync(payload);
  }

  async createSessionToken(userRecord: User) {
    const session = crypto.randomBytes(32).toString('hex');
    const sessionRecord = this.sessionRepository.create({
      session_token: session,
      user: userRecord,
    });
    await this.sessionRepository.save(sessionRecord);

    // Add session to user.
    userRecord.sessions ??= [];
    userRecord.sessions.push(sessionRecord);
    await this.userRepository.save(userRecord);

    return session;
  }

  async refreshJWT(req, sessionToken: string) {
    const sessionRecord: Session | null = await this.sessionRepository.findOne({
      where: { session_token: sessionToken },
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (sessionRecord && req.user.email === sessionRecord.user.email) {
      return {
        token: await this.createJWT(sessionRecord.user),
      };
    } else {
      throw new UnauthorizedException();
    }
  }
}
