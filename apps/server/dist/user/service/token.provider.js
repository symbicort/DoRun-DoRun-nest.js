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
exports.TokenProvider = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
let TokenProvider = class TokenProvider {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    generateToken(userId) {
        const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '30m' });
        const refreshToken = this.jwtService.sign({}, { expiresIn: '7d' });
        return {
            accessToken,
            refreshToken,
        };
    }
    async validateAndGetUserId(token) {
        const result = { result: false, msg: '' };
        try {
            const payload = await this.jwtService.verify(token);
            const userId = payload.sub;
            result.result = true;
            result.msg = userId;
            return result;
        }
        catch (error) {
            console.error('토큰 검증 오류:', error);
            return result;
        }
    }
    generateAccessToken(userId) {
        const accessToken = this.jwtService.sign({ sub: userId }, { expiresIn: '30m' });
        return {
            accessToken,
        };
    }
};
exports.TokenProvider = TokenProvider;
exports.TokenProvider = TokenProvider = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenProvider);
//# sourceMappingURL=token.provider.js.map