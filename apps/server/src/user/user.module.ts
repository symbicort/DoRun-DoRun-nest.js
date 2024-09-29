import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [JwtModule.register({
    secret: String(process.env.JWT_SECRET_KEY),
  }),]
})
export class UserModule {}
