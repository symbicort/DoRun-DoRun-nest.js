export declare class RegisterDto {
    userId: string;
    password: string;
    email: string;
}
export declare class RegisterResDto {
    result: boolean;
    userId: string;
    email: string;
}
export declare class LoginDto {
    userId: string;
    password: string;
}
export declare class ResDto {
    result: boolean;
    msg?: string;
    Token?: string;
}
export declare class LoginResDto {
    result: boolean;
    msg?: string;
    AccessToken?: string;
    RefreshToken?: string;
}
export declare class AuthUserDto {
    result: boolean;
    nickname?: string;
    userId?: string;
    NewToken?: string;
}
export declare class GetUserDto {
    result: boolean;
    userId: string;
    email: string;
    nickname: string;
    profileImg: string;
    roomId: string;
}
export declare class TokenDto {
    accessToken: string;
    refreshToken?: string;
}
export declare class SendChatDto {
    nickname: string;
    userMsg: string;
    aimsg: string;
    result: boolean;
    emotion: string;
}
export declare class RealLoginResDto {
    result: boolean;
    msg: string;
}
export declare class UpdateInfoDto {
    userid: string;
    email: string;
    inputpw: string;
}
export declare class WithdrawRequestDto {
    userId: string;
}
