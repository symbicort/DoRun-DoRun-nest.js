import { ConfigService } from '@nestjs/config';
export declare class S3Service {
    private readonly configService;
    private readonly logger;
    private readonly bucket;
    private readonly s3;
    constructor(configService: ConfigService);
    upload(file: Express.Multer.File): Promise<string>;
    delete(keyName: string): Promise<void>;
}
