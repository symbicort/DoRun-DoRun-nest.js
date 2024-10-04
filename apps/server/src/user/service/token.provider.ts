import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ResDto, TokenDto } from '../dto/user.dto';
import { UserService } from './user.service'; // 사용자 서비스 임포트

@Injectable()
export class TokenProvider {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // 사용자 서비스 주입
  ) {}

  // 로그인 시 토큰 생성
  generateToken(userId: string): TokenDto {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '30m' },
    );
    const refreshToken = this.jwtService.sign({}, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  // 토큰 검증 및 사용자 ID 반환 (비동기 작업 포함)
  async validateAndGetUserId(token: string): Promise<ResDto> {
    const result: ResDto = { result: false, msg: '' };

    try {
      const payload = await this.jwtService.verify(token);
      const userId = payload.sub;

      result.result = true;
      result.msg = userId;

      return result;
    } catch (error) {
      console.error('토큰 검증 오류:', error);
      return result;
    }
  }

  // 액세스 토큰 생성
  generateAccessToken(userId: string): TokenDto {
    const accessToken = this.jwtService.sign(
      { sub: userId },
      { expiresIn: '30m' },
    );

    return {
      accessToken,
    };
  }
}
