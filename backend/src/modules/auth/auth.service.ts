import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { Session } from 'src/entity/session.entity';
import { Repository } from 'typeorm';
import * as crypto from 'node:crypto';
import * as bcrypt from 'bcrypt';
import { Faculty } from 'src/entity/faculty.entity';
import { Student } from 'src/entity/student.entity';

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
  ) {}

  async register(email: string, password: string, isFaculty: boolean) {
    if (await this.userRepository.findOne({ where: { email: email } })) {
      return false; // exists.
    }
    const digest = bcrypt.hashSync(password, process.env.AUTH_SALT);
    const userRecord = this.userRepository.create({
      email: email,
      password_digest: digest,
    });

    if (isFaculty) {
      const facultyRecord = this.facultyRepository.create();
      await this.facultyRepository.save(facultyRecord);
      userRecord.faculty = facultyRecord;
    } else {
      const studentRecord = this.studentRepository.create();
      await this.studentRepository.save(studentRecord);
      userRecord.student = studentRecord;
    }
    await this.userRepository.save(userRecord);

    return true;
  }

  async login(email: string, password: string) {
    const userRecord = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!userRecord) {
      return false; // doesn't exist
    }

    if (await bcrypt.compare(password, userRecord.password_digest)) {
      const token = await this.generateSessionToken(userRecord);
      return token;
    } else {
      return false;
    }
  }

  private async generateSessionToken(user: User) {
    const token = crypto.randomBytes(32).toString('hex');
    const session = this.sessionRepository.create({
      user: user,
      session_id: token,
    });
    await this.sessionRepository.save(session);
    return token;
  }
}
