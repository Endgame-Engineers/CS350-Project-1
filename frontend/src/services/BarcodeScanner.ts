import { BrowserQRCodeReader } from '@zxing/browser';

export async function barcodeReader(video:HTMLVideoElement): Promise<string | null> {
    try{
        const codeReader = new BrowserQRCodeReader();
        return new Promise((resolve, reject) => {
            codeReader.decodeFromVideoDevice(undefined, video, (result, error, controls) => {
            if(result){
                resolve(result.getText());
            }
            else if (error){
                console.error('Error during scanning:', error);
                reject(error);
            }
            });
        });
    } catch (error) {
        console.error('Error initializing the barcode reader:', error);
        return null;
    }
}