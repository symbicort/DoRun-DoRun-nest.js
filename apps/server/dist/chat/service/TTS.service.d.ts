export declare class TTSService {
    private readonly xiApiKey;
    private readonly voice_ID;
    private readonly SERVER_PATH;
    private readonly LOCAL_PATH;
    private client;
    constructor();
    callExternalApi(text: string): Promise<void>;
}
