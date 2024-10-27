"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_dto_1 = require("../dto/user.dto");
const bcrypt = require("bcryptjs");
const token_provider_1 = require("./token.provider");
const user_repository_1 = require("../repository/user.repository");
let UserService = class UserService {
    constructor(userRepository, tokenProvider) {
        this.userRepository = userRepository;
        this.tokenProvider = tokenProvider;
    }
    async register(registerDto) {
        try {
            const encryptPw = await bcrypt.hash(registerDto.password, 10);
            registerDto.password = encryptPw;
            const data = await this.userRepository.save(registerDto);
            return { result: true, userId: data.userId, email: data.email };
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async login(loginDto) {
        const user = await this.userRepository.findByUserId(loginDto.userId);
        const result = new user_dto_1.LoginResDto();
        if (user) {
            if (user.deletedAt) {
                result.result = false;
                result.msg = '탈퇴한 계정의 아이디입니다.';
                return result;
            }
            const comparePW = await bcrypt.compare(loginDto.password, user.password);
            if (!comparePW) {
                result.result = false;
                result.msg = '비밀번호가 일치하지 않습니다';
                return result;
            }
            const tokenDto = this.tokenProvider.generateToken(loginDto.userId);
            console.log('액세스 토큰 확인', tokenDto.accessToken);
            await this.userRepository.updateRefreshToken(loginDto.userId, tokenDto.refreshToken);
            result.result = true;
            result.msg = '로그인 성공!';
            result.AccessToken = tokenDto.accessToken;
            result.RefreshToken = tokenDto.refreshToken;
            return result;
        }
        else {
            result.result = false;
            result.msg = '아이디가 존재하지 않습니다.';
            return result;
        }
    }
    async logout(token) {
        try {
            const loginUser = await this.tokenProvider.validateAndGetUserId(token);
            await this.userRepository.refreshTokenToNull(loginUser.Token);
            return true;
        }
        catch (e) {
            console.error('로그아웃 처리 중 오류 발생:', e);
            return false;
        }
    }
    async authuser(accessToken, RefreshToken) {
        try {
            const authuserDto = new user_dto_1.AuthUserDto();
            if (accessToken) {
                const validToken = await this.tokenProvider.validateAndGetUserId(accessToken);
                console.log(validToken.msg, validToken.result);
                const user = await this.userRepository.findByUserId(validToken.msg);
                console.log('유저 아이디', validToken.msg);
                authuserDto.result = true;
                authuserDto.nickname = user.nickname;
                authuserDto.userId = validToken.msg;
                return authuserDto;
            }
            if (RefreshToken) {
                const user = await this.userRepository.findNicknameFromToken(RefreshToken);
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
            authuserDto.result = false;
            authuserDto.nickname = '로그인 상태가 아닙니다.';
            return authuserDto;
        }
        catch (e) {
            throw new Error(e.message);
        }
    }
    async checkDupId(UserId) {
        return this.userRepository.existsByUserId(UserId);
    }
    async checkDupNick(Nickname) {
        return this.userRepository.existsByNickname(Nickname);
    }
    async getUserDto(nickname) {
        return this.userRepository.findByUserId(nickname);
    }
    async uploadProfileImg(awsurl, userid) {
        return this.userRepository.updateProfileImg(awsurl, userid);
    }
    async changePW(userid, inputpw, email) {
        const resDto = new user_dto_1.ResDto();
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
        }
        catch (e) {
            resDto.result = false;
            resDto.msg = '비밀번호 변경 중 오류가 발생했습니다.';
            console.error(e);
            return resDto;
        }
    }
    async changeEmail(userid, inputpw, email) {
        const resDto = new user_dto_1.ResDto();
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
        }
        catch (e) {
            resDto.result = false;
            resDto.msg = '이메일 정보 변경 중 에러가 발생하였습니다.';
            console.error(e);
            return resDto;
        }
    }
    async withdraw(userId) {
        const resDto = new user_dto_1.ResDto();
        try {
            console.log('회원탈퇴 유저 ID', userId);
            if (!(await this.userRepository.existsByUserId(userId))) {
                resDto.result = false;
                resDto.msg = '회원 아이디가 유효하지 않습니다.';
                return resDto;
            }
            await this.userRepository.softDeleteUserById(userId);
            resDto.result = true;
            resDto.msg = '회원 탈퇴가 완료되었습니다.';
        }
        catch (e) {
            resDto.result = false;
            resDto.msg = '회원 탈퇴 중 에러가 발생하였습니다.';
            console.error(e);
        }
        return resDto;
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        token_provider_1.TokenProvider])
], UserService);
//# sourceMappingURL=user.service.js.map