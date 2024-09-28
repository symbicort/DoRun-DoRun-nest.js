import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto, LoginDto, UserDto } from './dto/user.dto';
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

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const user = new User();
    const resDto = new UserDto();
    try {
      user.userId = createUserDto.userId;
      const encryptPw = await bcrypt.hash(createUserDto.password, 10);
      user.password = encryptPw;
      user.email = createUserDto.email;
      const result = await this.userRepository.save(user);
      console.log('회원가입 결과:', result);
      resDto.result = true;
      resDto.userId = createUserDto.userId;
      resDto.email = createUserDto.email;
      resDto.password = encryptPw;
      return resDto;
    } catch (e) {
      console.error('회원 가입 진행 중 에러 발생', e);
      resDto.result = false;
      return resDto;
    }
  }

  async login(loginDto: LoginDto): Promise<UserDto> {
    const user = await this.userRepository.findByUserId(loginDto.userId);
    const result = new UserDto();

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

      const userId = user.userId;
      const tokenDto = this.tokenProvider.generateToken(userId);
      console.log('액세스 토큰 확인', tokenDto.accessToken);

      await this.userRepository.updateRefreshToken(
        userId,
        tokenDto.refreshToken,
      );
      result.result = true;
      result.msg = '로그인 성공!';
      result.accessToken = tokenDto.accessToken;
      result.refreshToken = tokenDto.refreshToken;
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

  async authuser(accessToken: string, refreshToken: string): Promise<UserDto> {
    const authuserDto = new UserDto();

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

    if (refreshToken) {
      const user =
        await this.userRepository.findNicknameFromToken(refreshToken);
      if (!user) {
        console.log('리프레시 토큰 유저 없음');
        authuserDto.result = false;
        authuserDto.nickname = null;
        authuserDto.userId = null;

        return authuserDto;
      }

      const tokenDto = this.tokenProvider.generateAccessToken(user.userId);

      authuserDto.nickname = user.nickname;
      authuserDto.newToken = tokenDto.accessToken;
      authuserDto.userId = user.userId;
      authuserDto.result = true;

      return authuserDto;
    }

    // Both tokens are invalid
    authuserDto.result = false;
    authuserDto.nickname = '로그인 상태가 아닙니다.';
    return authuserDto;
  }

  async checkDupId(userId: string): Promise<boolean> {
    return this.userRepository.existsByUserId(userId);
  }

  async checkDupNick(nickname: string): Promise<boolean> {
    return this.userRepository.existsByNickname(nickname);
  }

  async getUserDto(userId: string): Promise<User> {
    return this.userRepository.findByUserId(userId);
  }

  async uploadProfileImg(awsurl: string, userId: string): Promise<boolean> {
    return this.userRepository.updateProfileImg(awsurl, userId);
  }

  async changePW(
    userId: string,
    inputpw: string,
    email: string,
  ): Promise<UserDto> {
    const resDto = new UserDto();
    try {
      const user = await this.userRepository.findByUserId(userId);

      if (user.email !== email) {
        resDto.result = false;
        resDto.msg = '이메일 정보가 등록된 정보와 일치하지 않습니다.';
        return resDto;
      }

      const encryptPw = await bcrypt.hash(inputpw, 10);

      await this.userRepository.updatePassword(userId, encryptPw);

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
    userId: string,
    inputpw: string,
    email: string,
  ): Promise<UserDto> {
    const resDto = new UserDto();
    try {
      const user = await this.userRepository.findByUserId(userId);

      const comparePW = await bcrypt.compare(inputpw, user.password);

      if (!comparePW) {
        resDto.result = false;
        resDto.msg = '비밀번호가 일치하지 않습니다';
        return resDto;
      }

      await this.userRepository.updateEmail(userId, email);

      resDto.result = true;
      resDto.msg = '이메일 변경이 완료되었습니다.';
      return resDto;
    } catch (e) {
      // 예외 발생 시 처리
      resDto.result = false;
      resDto.msg = '이메일 정보 변경 중 에러가 발생하였습니다.';
      console.error(e);
      return resDto;
    }
  }

  async withdraw(userId: string): Promise<UserDto> {
    const resDto = new UserDto();

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
