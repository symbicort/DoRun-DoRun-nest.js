import { UserService } from './service/user.service';
import { Response, Request } from 'express';
import { S3Service } from './service/s3.service';
import { RegisterResDto, ResDto, RealLoginResDto, AuthUserDto, GetUserDto, RegisterDto, LoginDto, UpdateInfoDto, WithdrawRequestDto } from './dto/user.dto';
export declare class UserController {
    private readonly userService;
    private readonly s3Service;
    constructor(userService: UserService, s3Service: S3Service);
    register(registerDto: RegisterDto): Promise<RegisterResDto>;
    checkDupId(inputId: string): Promise<boolean>;
    checkDupNickname(nickname: string): Promise<boolean>;
    uploadProfileImg(image: Express.Multer.File, userId: string): Promise<ResDto>;
    login(loginDto: LoginDto, response: Response): Promise<RealLoginResDto>;
    logout(response: Response, request: Request): Promise<ResDto>;
    authUser(response: Response, request: Request): Promise<AuthUserDto>;
    getUserInfo(request: Request): Promise<GetUserDto>;
    changePW(updateInfoDto: UpdateInfoDto): Promise<ResDto>;
    changeEmail(updateInfoDto: UpdateInfoDto): Promise<ResDto>;
    withdraw(response: Response, withdrawRequestDto: WithdrawRequestDto): Promise<ResDto>;
}
