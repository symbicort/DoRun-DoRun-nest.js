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
var S3Service_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.S3Service = void 0;
const common_1 = require("@nestjs/common");
const aws_sdk_1 = require("aws-sdk");
const config_1 = require("@nestjs/config");
let S3Service = S3Service_1 = class S3Service {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(S3Service_1.name);
        this.bucket = this.configService.get('AWS_S3_BUCKET');
        this.s3 = new aws_sdk_1.S3();
    }
    async upload(file) {
        const originalFilename = file.originalname;
        const extension = originalFilename.substring(originalFilename.lastIndexOf('.'));
        const timestamp = Date.now();
        const s3FileName = `${originalFilename.replace(/[^a-zA-Z0-9가-힣_.-]/g, '_')}_${timestamp}${extension}`;
        const contentType = file.mimetype;
        const params = {
            Bucket: this.bucket,
            Key: s3FileName,
            Body: file.buffer,
            ContentType: contentType,
        };
        try {
            await this.s3.upload(params).promise();
            const fileUrl = this.s3.getSignedUrl('getObject', {
                Bucket: this.bucket,
                Key: s3FileName,
                Expires: 60 * 60,
            });
            this.logger.debug(`File uploaded: ${fileUrl}`);
            return fileUrl;
        }
        catch (error) {
            this.logger.error(`Error uploading file: ${error.message}`);
            throw error;
        }
    }
    async delete(keyName) {
        const params = {
            Bucket: this.bucket,
            Key: keyName,
        };
        try {
            await this.s3.deleteObject(params).promise();
            this.logger.debug(`File deleted: ${keyName}`);
        }
        catch (error) {
            this.logger.error(`Error deleting file: ${error.message}`);
            throw error;
        }
    }
};
exports.S3Service = S3Service;
exports.S3Service = S3Service = S3Service_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], S3Service);
//# sourceMappingURL=s3.service.js.map