import { JwtService } from '@nestjs/jwt';
import { ResDto, TokenDto } from '../dto/user.dto';
export declare class TokenProvider {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateToken(userId: string): TokenDto;
    validateAndGetUserId(token: string): Promise<ResDto>;
    generateAccessToken(userId: string): TokenDto;
}
