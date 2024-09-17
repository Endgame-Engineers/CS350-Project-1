<template>
    <div>
        <video ref="webCam" autoplay></video>
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { barcodeReader } from '@/services/BarcodeScanner';
import router from '@/router';

export default {
    name: 'ScannerPage',
    
    setup() {
        const webCam = ref<HTMLVideoElement | null>(null);
        const selectedDeviceId = null;
        const barCodeNum = null as null | string
        const constraints = {
            video: {
                width: 1280,
                height: 720,
            },
        };

        onMounted(() => {
            navigator.mediaDevices.getUserMedia(constraints).then(async (stream) => {
                if (webCam.value) {
                    webCam.value.srcObject = stream;
                    const barCodeNum = await barcodeReader(webCam.value, selectedDeviceId)
                    if (barCodeNum) {
                        router.push({ path: '/Search', query: { string: barCodeNum } });
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                    router.push('/Home');
                });
            });

        return {
            webCam,
            barCodeNum,
        };
    },
};
</script>