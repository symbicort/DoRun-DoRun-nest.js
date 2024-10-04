import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Req,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './service/user.service';
import { Response, Request } from 'express';
import { TokenProvider } from './service/token.provider';
import { S3Service } from './service/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatService } from 'src/chat/service/chat.service';
import {
  RegisterResDto,
  ResDto,
  RealLoginResDto,
  AuthUserDto,
  GetUserDto,
  RegisterDto,
  LoginDto,
  UpdateInfoDto,
  WithdrawRequestDto,
} from './dto/user.dto';
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly tokenProvider: TokenProvider,
    private readonly s3Service: S3Service,
    private readonly chatService: ChatService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResDto> {
    try {
      return await this.userService.register(registerDto);
    } catch (e) {
      console.error('회원 가입 실패:', e);
      return null;
    }
  }

  @Get('checkDupId')
  async checkDupId(@Query('InputId') inputId: string): Promise<boolean> {
    return this.userService.checkDupId(inputId);
  }

  @Get('checkDupNick')
  async checkDupNickname(
    @Query('nickname') nickname: string,
  ): Promise<boolean> {
    return this.userService.checkDupNick(nickname);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadProfileImg(
    @UploadedFile() image: Express.Multer.File,
    @Query('userid') userId: string,
  ): Promise<ResDto> {
    const resDto = new ResDto();
    try {
      const awsurl = await this.s3Service.upload(image);
      if (!awsurl) {
        resDto.result = false;
        resDto.msg = '이미지 업로드 실패';
        return resDto;
      }
      const result = await this.userService.uploadProfileImg(awsurl, userId);
      resDto.result = result;
      resDto.msg = awsurl;
      return resDto;
    } catch (e) {
      console.error('이미지 업로드 중 오류 발생:', e);
      resDto.result = false;
      resDto.msg = '이미지 업로드 중 오류 발생';
      return resDto;
    }
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<RealLoginResDto> {
    const resDto = new RealLoginResDto();
    try {
      const result = await this.userService.login(loginDto);
      if (!result.result) {
        resDto.result = result.result;
        resDto.msg = result.msg;
        return resDto;
      }

      response.cookie('accessToken', result.AccessToken, {
        maxAge: 1800 * 1000, // 30분
        httpOnly: true,
        sameSite: 'lax',
      });
      response.cookie('refreshToken', result.RefreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
        httpOnly: true,
        sameSite: 'lax',
      });

      resDto.result = result.result;
      resDto.msg = result.msg;

      return resDto;
    } catch (e) {
      console.error('로그인 중 오류 발생:', e);
      resDto.result = false;
      resDto.msg = '로그인 중 오류 발생';
      return resDto;
    }
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<ResDto> {
    const resDto = new ResDto();
    try {
      const accessToken = request.cookies['accessToken'];
      const refreshToken = request.cookies['refreshToken'];

      if (!accessToken && !refreshToken) {
        resDto.result = false;
        resDto.msg = '로그인 상태가 아닙니다.';
        return resDto;
      }

      const result = await this.userService.logout(accessToken);

      response.clearCookie('accessToken');
      response.clearCookie('refreshToken');

      resDto.result = result;
      return resDto;
    } catch (e) {
      console.error('로그아웃 처리 중 오류 발생:', e);
      resDto.result = false;
      resDto.msg = '로그아웃 처리 중 오류가 발생했습니다.';
      return resDto;
    }
  }

  @Get('authuser')
  async authUser(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ): Promise<AuthUserDto> {
    const resDto = new AuthUserDto();
    try {
      const accessToken = request.cookies['accessToken'];
      const refreshToken = request.cookies['refreshToken'];

      if (!refreshToken) {
        resDto.result = false;
        resDto.nickname = '로그인 상태가 아닙니다.';
        return resDto;
      }

      const authuser = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      if (authuser.NewToken) {
        response.cookie('accessToken', authuser.NewToken, {
          maxAge: 1800 * 1000, // 30분
          httpOnly: true,
          sameSite: 'lax',
        });

        resDto.result = true;
        resDto.nickname = authuser.nickname;
        resDto.userId = authuser.userId;

        return resDto;
      }

      resDto.result = true;
      resDto.nickname = authuser.nickname;
      resDto.userId = authuser.userId;

      return resDto;
    } catch (e) {
      console.error('인증 처리 중 오류 발생:', e);
      resDto.result = false;
      resDto.nickname = '인증 처리 중 오류가 발생했습니다.';
      return resDto;
    }
  }

  @Get('info')
  async getUserInfo(@Req() request: Request): Promise<GetUserDto> {
    const resDto = new GetUserDto();
    try {
      const accessToken = request.cookies['accessToken'];
      const refreshToken = request.cookies['refreshToken'];

      const authuser = await this.userService.authuser(
        accessToken,
        refreshToken,
      );

      const user = await this.userService.getUserDto(authuser.userId);

      resDto.result = true;
      resDto.userId = user.userId;
      resDto.email = user.email;
      resDto.nickname = user.nickname;
      resDto.profileImg = user.profileImg;
      resDto.roomId = user.roomId;

      return resDto;
    } catch (e) {
      console.error('정보 조회 중 오류 발생:', e);
      resDto.result = false;
      resDto.nickname = '정보 조회 중 오류가 발생했습니다.';
      return resDto;
    }
  }

  @Patch('changePW')
  async changePW(@Body() updateInfoDto: UpdateInfoDto): Promise<ResDto> {
    return this.userService.changePW(
      updateInfoDto.userid,
      updateInfoDto.inputpw,
      updateInfoDto.email,
    );
  }

  @Patch('changeEmail')
  async changeEmail(@Body() updateInfoDto: UpdateInfoDto): Promise<ResDto> {
    return this.userService.changeEmail(
      updateInfoDto.userid,
      updateInfoDto.inputpw,
      updateInfoDto.email,
    );
  }

  @Delete('withdraw')
  async withdraw(
    @Res({ passthrough: true }) response: Response,
    @Body() withdrawRequestDto: WithdrawRequestDto,
  ): Promise<ResDto> {
    const resDto = await this.userService.withdraw(withdrawRequestDto.userId);

    response.clearCookie('accessToken');
    response.clearCookie('refreshToken');

    return resDto;
  }
}
