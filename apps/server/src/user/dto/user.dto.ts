import { IsString, IsBoolean, IsEmail, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class RegisterDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}

export class RegisterResDto {
  @IsBoolean()
  result: boolean;

  @IsString()
  userId: string;

  @IsString()
  password: string;

  @IsString()
  email: string;
}

export class LoginDto {
  @IsString()
  userId: string;

  @IsString()
  password: string;
}

export class ResDto {
  @IsBoolean()
  result: boolean;

  @IsOptional()
  @IsString()
  msg?: string;

  @IsOptional()
  @IsString()
  Token?: string;
}

export class LoginResDto {
  @IsBoolean()
  result: boolean;

  @IsOptional()
  @IsString()
  msg?: string;

  @IsOptional()
  @IsString()
  AccessToken?: string;

  @IsOptional()
  @IsString()
  RefreshToken?: string;
}

export class AuthUserDto {
  @IsBoolean()
  result: boolean;

  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  NewToken?: string;
}

export class GetUserDto {
  @IsBoolean()
  result: boolean;

  @IsString()
  userId: string;

  @IsString()
  email: string;

  @IsString()
  nickname: string;

  @IsString()
  profileImg: string;

  @IsString()
  roomId: string;
}

export class TokenDto {
  @IsString()
  accessToken: string;

  @IsOptional()
  @IsString()
  refreshToken?: string;
}

export class SendChatDto {
  @IsString()
  nickname: string;

  @IsString()
  userMsg: string;

  @IsString()
  Aimsg: string;

  @IsBoolean()
  result: boolean;

  @IsString()
  emotion: string;
}

export class RealLoginResDto {
  @IsBoolean()
  result: boolean;

  @IsString()
  msg: string;
}

export class UpdateInfoDto {
  @IsString()
  userid: string;

  @IsEmail()
  email: string;

  @IsString()
  inputpw: string;
}

export class WithdrawRequestDto {
  @IsString()
  userId: string;
}
