import { Module } from '@nestjs/common';
import { UserService } from './service/user.service';
import { JwtModule } from '@nestjs/jwt';
import { S3Service } from './service/s3.service';
import { UserController } from './user.controller';

@Module({
  controllers: [UserController],
  providers: [UserService, S3Service],
  imports: [JwtModule.register({
    secret: String(process.env.JWT_SECRET_KEY),
  }),]
})
export class UserModule {}
