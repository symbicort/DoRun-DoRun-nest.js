import { User } from '../entity/user.entity';
import { RegisterDto, LoginDto, ResDto, LoginResDto, AuthUserDto, RegisterResDto } from '../dto/user.dto';
import { TokenProvider } from './token.provider';
import { UserRepository } from '../repository/user.repository';
export declare class UserService {
    private readonly userRepository;
    private readonly tokenProvider;
    constructor(userRepository: UserRepository, tokenProvider: TokenProvider);
    register(registerDto: RegisterDto): Promise<RegisterResDto>;
    login(loginDto: LoginDto): Promise<LoginResDto>;
    logout(token: string): Promise<boolean>;
    authuser(accessToken: string, RefreshToken: string): Promise<AuthUserDto>;
    checkDupId(UserId: string): Promise<boolean>;
    checkDupNick(Nickname: string): Promise<boolean>;
    getUserDto(nickname: string): Promise<User>;
    uploadProfileImg(awsurl: string, userid: string): Promise<boolean>;
    changePW(userid: string, inputpw: string, email: string): Promise<ResDto>;
    changeEmail(userid: string, inputpw: string, email: string): Promise<ResDto>;
    withdraw(userId: string): Promise<ResDto>;
}
