import { BrowserMultiFormatReader, Result } from "@zxing/library";

export async function barcodeReader(video:HTMLVideoElement, selectedDeviceId: string | null): Promise<string | null> {
    try{
        const codeReader = new BrowserMultiFormatReader();
        return new Promise((resolve, reject) => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result: Result | null, error: any) => {
            if(result){
                console.log(result.getText())
                resolve(result.getText());
                codeReader.reset();
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