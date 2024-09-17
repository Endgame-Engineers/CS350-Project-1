import { BrowserMultiFormatReader, Result } from "@zxing/library";

export async function barcodeReader(video:HTMLVideoElement, selectedDeviceId: string | null): Promise<string | null> {
    try{
        const codeReader = new BrowserMultiFormatReader();
        return new Promise((resolve, reject) => {
            codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result: Result | null, error: any) => {
            if(result){
                console.log(result.getText())
                codeReader.reset();
                resolve(result.getText());
            }
            else if (error && error.message !== "No MultiFormat Readers were able to detect the code."){
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