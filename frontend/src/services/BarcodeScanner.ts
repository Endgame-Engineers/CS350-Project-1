import { BrowserMultiFormatReader, Result } from "@zxing/library";
class BarcodeScanner {
    codeReader: BrowserMultiFormatReader;
    constructor() {
        this.codeReader = new BrowserMultiFormatReader();
    }
    async barcodeReader(video: HTMLVideoElement, selectedDeviceId: string | null): Promise<string | null> {
        try {
            return new Promise((resolve, reject) => {
                this.codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result: Result | null, error: any) => {
                    if (result) {
                        console.log(result.getText());
                        this.codeReader.reset();
                        resolve(result.getText());
                    } else if (error && error.message !== "No MultiFormat Readers were able to detect the code.") {
                        console.error("Error during scanning:", error);
                        reject(error);
                    }
                });
            });
        } catch (error) {
            console.error("Error initializing the barcode reader:", error);
            return null;
        }
    }

    async closeBarcodeReader() {
        this.codeReader.reset();
    }
}
export default new BarcodeScanner();