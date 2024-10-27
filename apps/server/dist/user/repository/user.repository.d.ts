import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { RegisterDto } from '../dto/user.dto';
export declare class UserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    save(data: RegisterDto): Promise<RegisterDto & User>;
    existsByUserId(userId: string): Promise<boolean>;
    existsByNickname(nickname: string): Promise<boolean>;
    findByNickname(nickname: string): Promise<User | undefined>;
    findByUserId(userId: string): Promise<User | undefined>;
    updateRefreshToken(userId: string, refreshToken: string): Promise<void>;
    updateProfileImg(userId: string, awsurl: string): Promise<boolean>;
    refreshTokenToNull(userId: string): Promise<void>;
    findNicknameFromToken(refreshToken: string): Promise<User | undefined>;
    updatePassword(userId: string, encryptPw: string): Promise<void>;
    updateEmail(userId: string, email: string): Promise<void>;
    selectUserId(userId: string): Promise<boolean>;
    softDeleteUserById(userId: string): Promise<void>;
}
