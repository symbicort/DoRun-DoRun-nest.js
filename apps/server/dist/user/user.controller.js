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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./service/user.service");
const s3_service_1 = require("./service/s3.service");
const platform_express_1 = require("@nestjs/platform-express");
const user_dto_1 = require("./dto/user.dto");
let UserController = class UserController {
    constructor(userService, s3Service) {
        this.userService = userService;
        this.s3Service = s3Service;
    }
    async register(registerDto) {
        try {
            return await this.userService.register(registerDto);
        }
        catch (e) {
            console.error('회원 가입 실패:', e);
            return null;
        }
    }
    async checkDupId(inputId) {
        return this.userService.checkDupId(inputId);
    }
    async checkDupNickname(nickname) {
        return this.userService.checkDupNick(nickname);
    }
    async uploadProfileImg(image, userId) {
        const resDto = new user_dto_1.ResDto();
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
        }
        catch (e) {
            console.error('이미지 업로드 중 오류 발생:', e);
            resDto.result = false;
            resDto.msg = '이미지 업로드 중 오류 발생';
            return resDto;
        }
    }
    async login(loginDto, response) {
        const resDto = new user_dto_1.RealLoginResDto();
        try {
            const result = await this.userService.login(loginDto);
            if (!result.result) {
                resDto.result = result.result;
                resDto.msg = result.msg;
                return resDto;
            }
            response.cookie('accessToken', result.AccessToken, {
                maxAge: 1800 * 1000,
                httpOnly: true,
                sameSite: 'lax',
            });
            response.cookie('refreshToken', result.RefreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
            });
            resDto.result = result.result;
            resDto.msg = result.msg;
            return resDto;
        }
        catch (e) {
            console.error('로그인 중 오류 발생:', e);
            resDto.result = false;
            resDto.msg = '로그인 중 오류 발생';
            return resDto;
        }
    }
    async logout(response, request) {
        const resDto = new user_dto_1.ResDto();
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
        }
        catch (e) {
            console.error('로그아웃 처리 중 오류 발생:', e);
            resDto.result = false;
            resDto.msg = '로그아웃 처리 중 오류가 발생했습니다.';
            return resDto;
        }
    }
    async authUser(response, request) {
        const resDto = new user_dto_1.AuthUserDto();
        try {
            const accessToken = request.cookies['accessToken'];
            const refreshToken = request.cookies['refreshToken'];
            if (!refreshToken) {
                resDto.result = false;
                resDto.nickname = '로그인 상태가 아닙니다.';
                return resDto;
            }
            const authuser = await this.userService.authuser(accessToken, refreshToken);
            if (authuser.NewToken) {
                response.cookie('accessToken', authuser.NewToken, {
                    maxAge: 1800 * 1000,
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
        }
        catch (e) {
            console.error('인증 처리 중 오류 발생:', e);
            resDto.result = false;
            resDto.nickname = '인증 처리 중 오류가 발생했습니다.';
            return resDto;
        }
    }
    async getUserInfo(request) {
        const resDto = new user_dto_1.GetUserDto();
        try {
            const accessToken = request.cookies['accessToken'];
            const refreshToken = request.cookies['refreshToken'];
            const authuser = await this.userService.authuser(accessToken, refreshToken);
            const user = await this.userService.getUserDto(authuser.userId);
            resDto.result = true;
            resDto.userId = user.userId;
            resDto.email = user.email;
            resDto.nickname = user.nickname;
            resDto.profileImg = user.profileImg;
            resDto.roomId = user.roomId;
            return resDto;
        }
        catch (e) {
            console.error('정보 조회 중 오류 발생:', e);
            resDto.result = false;
            resDto.nickname = '정보 조회 중 오류가 발생했습니다.';
            return resDto;
        }
    }
    async changePW(updateInfoDto) {
        return this.userService.changePW(updateInfoDto.userid, updateInfoDto.inputpw, updateInfoDto.email);
    }
    async changeEmail(updateInfoDto) {
        return this.userService.changeEmail(updateInfoDto.userid, updateInfoDto.inputpw, updateInfoDto.email);
    }
    async withdraw(response, withdrawRequestDto) {
        const resDto = await this.userService.withdraw(withdrawRequestDto.userId);
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken');
        return resDto;
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.RegisterDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('checkDupId'),
    __param(0, (0, common_1.Query)('InputId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkDupId", null);
__decorate([
    (0, common_1.Get)('checkDupNick'),
    __param(0, (0, common_1.Query)('nickname')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "checkDupNickname", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Query)('userid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "uploadProfileImg", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.LoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('logout'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "logout", null);
__decorate([
    (0, common_1.Get)('authuser'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "authUser", null);
__decorate([
    (0, common_1.Get)('info'),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfo", null);
__decorate([
    (0, common_1.Patch)('changePW'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateInfoDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePW", null);
__decorate([
    (0, common_1.Patch)('changeEmail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_dto_1.UpdateInfoDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changeEmail", null);
__decorate([
    (0, common_1.Delete)('withdraw'),
    __param(0, (0, common_1.Res)({ passthrough: true })),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.WithdrawRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "withdraw", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        s3_service_1.S3Service])
], UserController);
//# sourceMappingURL=user.controller.js.map