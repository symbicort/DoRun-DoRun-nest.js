import { Injectable, Logger } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly bucket: string;
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.bucket = this.configService.get<string>('AWS_S3_BUCKET');
    this.s3 = new S3();
  }

  async upload(file: Express.Multer.File): Promise<string> {
    const originalFilename = file.originalname;
    const extension = originalFilename.substring(
      originalFilename.lastIndexOf('.'),
    );

    // 파일 이름에 타임스탬프를 추가하여 고유성을 확보
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
        Expires: 60 * 60, // 1시간 동안 유효한 URL
      });

      this.logger.debug(`File uploaded: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      this.logger.error(`Error uploading file: ${error.message}`);
      throw error;
    }
  }

  async delete(keyName: string): Promise<void> {
    const params = {
      Bucket: this.bucket,
      Key: keyName,
    };

    try {
      await this.s3.deleteObject(params).promise();
      this.logger.debug(`File deleted: ${keyName}`);
    } catch (error) {
      this.logger.error(`Error deleting file: ${error.message}`);
      throw error;
    }
  }
}
