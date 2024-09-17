import { BrowserMultiFormatReader, Result } from '@zxing/library';


export async function barcodeReader(video: HTMLVideoElement, selectedDeviceId: string, codeReader: BrowserMultiFormatReader ): Promise<string> {
    try{
        return new Promise((resolve, reject) => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result: Result | null, error: any) => {
                
            if(result){
                console.log('Found barcode:', result.getText());
                resolve(result.getText());
            }
            else if (error){
                reject(error);
            }
            });
        });
    } catch (error) {
        return '';
    }
}