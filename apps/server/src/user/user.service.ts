import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import {
  RegisterDto,
  LoginDto,
  ResDto,
  LoginResDto,
  TokenDto,
  AuthUserDto,
  GetUserDto,
  UpdateInfoDto,
  WithdrawRequestDto,
  RegisterResDto,
} from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { TokenProvider } from '../jwt/token.provider';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async register(registerDto: RegisterDto): Promise<RegisterResDto> {
    const user = new User();
    const registerResDto = new RegisterResDto();
    try {
      user.userId = registerDto.userId;
      const encryptPw = await bcrypt.hash(registerDto.password, 10);
      user.password = encryptPw;
      user.email = registerDto.email;
      const result = await this.userRepository.save(user);
      console.log('회원가입 결과:', result);
      registerResDto.result = true;
      registerResDto.userId = registerDto.userId;
      registerResDto.email = registerDto.email;
      registerResDto.password = encryptPw;
      return registerResDto;
    } catch (e) {
      console.error('회원 가입 진행 중 에러 발생', e);
      registerResDto.result = false;
      return registerResDto;
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResDto> {
    const user = await this.userRepository.findByUserId(loginDto.userId);
    const result = new LoginResDto();

    if (user) {
      if (user.deletedAt) {
        result.result = false;
        result.msg = '탈퇴한 계정의 아이디입니다.';
        return result;
      }

      // 비밀번호 일치 여부 확인
      const comparePW = await bcrypt.compare(loginDto.password, user.password);

      // 비밀번호 일치 하지 않을 경우 리턴
      if (!comparePW) {
        result.result = false;
        result.msg = '비밀번호가 일치하지 않습니다';
        return result;
      }

      const tokenDto = this.tokenProvider.generateToken(loginDto.userId);
      console.log('액세스 토큰 확인', tokenDto.accessToken);

      await this.userRepository.updateRefreshToken(
        loginDto.userId,
        tokenDto.refreshToken,
      );
      result.result = true;
      result.msg = '로그인 성공!';
      result.AccessToken = tokenDto.accessToken;
      result.RefreshToken = tokenDto.refreshToken;
      return result;
    } else {
      result.result = false;
      result.msg = '아이디가 존재하지 않습니다.';
      return result;
    }
  }

  async logout(token: string): Promise<boolean> {
    try {
      console.log(token);
      const loginUser = this.tokenProvider.validateAndGetUserId(token);
      console.log('토큰 유효 여부 확인', loginUser);

      await this.userRepository.refreshTokenToNull(loginUser.msg);

      return true;
    } catch (e) {
      console.error('로그아웃 처리 중 오류 발생:', e);
      return false;
    }
  }

  async authuser(
    accessToken: string,
    RefreshToken: string,
  ): Promise<AuthUserDto> {
    const authuserDto = new AuthUserDto();

    if (accessToken) {
      console.log('액세스 토큰 존재');
      try {
        const validToken = this.tokenProvider.validateAndGetUserId(accessToken);

        console.log(validToken.msg, validToken.result);

        const user = await this.userRepository.findByUserId(validToken.msg);

        console.log('유저 아이디', validToken.msg);

        authuserDto.result = true;
        authuserDto.nickname = user.nickname;
        authuserDto.userId = validToken.msg;

        return authuserDto;
      } catch (e) {
        // Access token is invalid, proceed to refresh token check
      }
    }

    if (RefreshToken) {
      const user =
        await this.userRepository.findNicknameFromToken(RefreshToken);
      if (!user) {
        console.log('리프레시 토큰 유저 없음');
        authuserDto.result = false;
        authuserDto.nickname = null;
        authuserDto.userId = null;

        return authuserDto;
      }

      const tokenDto = this.tokenProvider.generateAccessToken(user.userId);

      authuserDto.nickname = user.nickname;
      authuserDto.NewToken = tokenDto.accessToken;
      authuserDto.userId = user.userId;
      authuserDto.result = true;

      return authuserDto;
    }

    // Both tokens are invalid
    authuserDto.result = false;
    authuserDto.nickname = '로그인 상태가 아닙니다.';
    return authuserDto;
  }

  async checkDupId(UserId: string): Promise<boolean> {
    return this.userRepository.existsByUserId(UserId);
  }

  async checkDupNick(Nickname: string): Promise<boolean> {
    return this.userRepository.existsByNickname(Nickname);
  }

  async getUserDto(nickname: string): Promise<User> {
    return this.userRepository.findByUserId(nickname);
  }

  async uploadProfileImg(awsurl: string, userid: string): Promise<boolean> {
    return this.userRepository.updateProfileImg(awsurl, userid);
  }

  async changePW(
    userid: string,
    inputpw: string,
    email: string,
  ): Promise<ResDto> {
    const resDto = new ResDto();
    try {
      const user = await this.userRepository.findByUserId(userid);

      if (!user || user.email !== email) {
        resDto.result = false;
        resDto.msg = '이메일 정보가 등록된 정보와 일치하지 않습니다.';
        return resDto;
      }

      const encryptPw = await bcrypt.hash(inputpw, 10);

      await this.userRepository.updatePassword(userid, encryptPw);

      resDto.result = true;
      resDto.msg = '비밀번호 변경이 완료되었습니다.';
      return resDto;
    } catch (e) {
      resDto.result = false;
      resDto.msg = '비밀번호 변경 중 오류가 발생했습니다.';
      console.error(e);
      return resDto;
    }
  }

  async changeEmail(
    userid: string,
    inputpw: string,
    email: string,
  ): Promise<ResDto> {
    const resDto = new ResDto();
    try {
      const user = await this.userRepository.findByUserId(userid);

      if (!user) {
        resDto.result = false;
        resDto.msg = '사용자를 찾을 수 없습니다.';
        return resDto;
      }

      const comparePW = await bcrypt.compare(inputpw, user.password);

      if (!comparePW) {
        resDto.result = false;
        resDto.msg = '비밀번호가 일치하지 않습니다';
        return resDto;
      }

      await this.userRepository.updateEmail(userid, email);

      resDto.result = true;
      resDto.msg = '이메일 변경이 완료되었습니다.';
      return resDto;
    } catch (e) {
      resDto.result = false;
      resDto.msg = '이메일 정보 변경 중 에러가 발생하였습니다.';
      console.error(e);
      return resDto;
    }
  }

  async withdraw(userId: string): Promise<ResDto> {
    const resDto = new ResDto();

    try {
      console.log('회원탈퇴 유저 ID', userId);
      // 회원 아이디의 유효성을 검사하고 존재하지 않는 경우 예외 처리
      if (!(await this.userRepository.existsByUserId(userId))) {
        resDto.result = false;
        resDto.msg = '회원 아이디가 유효하지 않습니다.';
        return resDto;
      }

      // 회원 탈퇴를 위해 softDeleteUserById 메소드 호출
      await this.userRepository.softDeleteUserById(userId);

      resDto.result = true;
      resDto.msg = '회원 탈퇴가 완료되었습니다.';
    } catch (e) {
      // 예외 발생 시 롤백되도록 처리
      resDto.result = false;
      resDto.msg = '회원 탈퇴 중 에러가 발생하였습니다.';
      console.error(e); // 예외 정보 로깅
    }

    return resDto;
  }
}
