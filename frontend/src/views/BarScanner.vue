<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import BarcodeScanner from '@/services/BarcodeScanner';
import { checkForBackCamera } from '@/services/CheckForBackCamera';
import router from '@/router';
import { logger } from '@/services/Logger';

export default {
    name: 'ScannerPage',
    
    setup() {
        const webCam = ref<HTMLVideoElement | null>(null);
        const selectedDeviceId = ref<string | null>(null);
        const barCodeNum = null as null | string;
        const stream = ref<MediaStream | null>(null);

        onMounted(async () => {
            logger.info('ScannerPage mounted');
            const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
            selectedDeviceId.value = await checkForBackCamera();
            initialStream.getTracks().forEach(track => track.stop());

            const constraints = {
                video: {
                    deviceId: selectedDeviceId.value ? { exact: selectedDeviceId.value } : undefined,
                    width: 1280,
                    height: 720,
                },
            };
                try {

                    stream.value = await navigator.mediaDevices.getUserMedia(constraints);
                    if (webCam.value) {
                        logger.info('Webcam found');
                        webCam.value.srcObject = stream.value;
                        const barCodeNum = await BarcodeScanner.barcodeReader(webCam.value, selectedDeviceId.value)
                        if (barCodeNum) {
                            logger.info('Barcode found: ' + barCodeNum);
                            router.push({ path: '/search', query: { string: barCodeNum } });
                        }
                    }
                } catch (error) {
                    logger.error('Error accessing the camera: ' + error);
                    router.push('/');
                }
            });

            onUnmounted(()=>{
                if(stream.value){
                    stream.value.getTracks().forEach(track => track.stop());
                    logger.info('ScannerPage unmounted');
                }

                BarcodeScanner.closeBarcodeReader();
                logger.info('Barcode reader closed');
            });

        return {
            webCam,
            barCodeNum,
        };
    },
};
</script>

<template>
    <div class="video-container">
        <video ref="webCam" autoplay playsinline></video>
    </div>
</template>