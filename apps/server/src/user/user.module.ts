import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { S3Service } from './service/s3.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { TokenProvider } from './service/token.provider';
import { UserRepository } from './repository/user.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, S3Service, TokenProvider, UserRepository],
  imports: [
    JwtModule.register({
      secret: String(process.env.JWT_SECRET_KEY),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [UserRepository, UserService]
})
export class UserModule {}
