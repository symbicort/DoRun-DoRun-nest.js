import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { RegisterDto } from '../dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(data: RegisterDto) {
    return await this.userRepository.save(data);
  }

  async existsByUserId(userId: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { userId } });
    return count > 0;
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    const count = await this.userRepository.count({ where: { nickname } });
    return count > 0;
  }

  async findByNickname(nickname: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { nickname } });
  }

  async findByUserId(userId: string): Promise<User | undefined> {
    return await this.userRepository.findOne({ where: { userId } });
  }

  async updateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshKey: refreshToken })
      .where('userId = :userId', { userId })
      .execute();
  }

  async updateProfileImg(userId: string, awsurl: string): Promise<boolean> {
    const result = await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ profileImg: awsurl })
      .where('userId = :userId', { userId })
      .execute();
    return result.affected > 0;
  }

  async refreshTokenToNull(userId: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshKey: null })
      .where('userId = :userId', { userId })
      .execute();
  }

  async findNicknameFromToken(refreshToken: string): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: { refreshKey: refreshToken },
    });
  }

  async updatePassword(userId: string, encryptPw: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ password: encryptPw })
      .where('userId = :userId', { userId })
      .execute();
  }

  async updateEmail(userId: string, email: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ email })
      .where('userId = :userId', { userId })
      .execute();
  }

  async selectUserId(userId: string): Promise<boolean> {
    const count = await this.userRepository.count({
      where: { userId, deletedAt: null },
    });
    return count > 0;
  }

  async softDeleteUserById(userId: string): Promise<void> {
    await this.userRepository
      .createQueryBuilder()
      .update(User)
      .set({ deletedAt: new Date() })
      .where('userId = :userId', { userId })
      .execute();
  }
}
