import { BrowserMultiFormatReader, Result } from "@zxing/library";

class BarcodeScanner {
    private codeReader: BrowserMultiFormatReader | null = null;

    private getCodeReader(): BrowserMultiFormatReader {
        if (!this.codeReader) {
            this.codeReader = new BrowserMultiFormatReader();
        }
        return this.codeReader;
    }

    async barcodeReader(video: HTMLVideoElement, selectedDeviceId: string | null): Promise<string | null> {
        try {
            const codeReader = this.getCodeReader();
            return new Promise((resolve, reject) => {
                codeReader.decodeFromVideoDevice(selectedDeviceId, video, (result: Result | null, error: Error | undefined) => {
                    if (result) {
                        console.log(result.getText());
                        codeReader.reset();
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
        const codeReader = this.getCodeReader();
        codeReader.reset();
    }
}

export default new BarcodeScanner();
