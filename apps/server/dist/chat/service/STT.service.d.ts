export declare class STTService {
    private speechClient;
    constructor();
    speechToText(file: Express.Multer.File): Promise<string>;
}
