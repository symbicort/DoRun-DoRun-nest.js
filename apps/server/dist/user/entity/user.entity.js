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
exports.User = void 0;
const typeorm_1 = require("typeorm");
let User = class User {
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ name: 'user_num' }),
    __metadata("design:type", Number)
], User.prototype, "userNum", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email', nullable: false }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'nickname', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({
        name: 'created_at',
        type: 'timestamp',
    }),
    __metadata("design:type", Date)
], User.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at', nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_img', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "profileImg", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_key', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "refreshKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'room_id', nullable: true }),
    __metadata("design:type", String)
], User.prototype, "roomId", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('user')
], User);
//# sourceMappingURL=user.entity.js.map