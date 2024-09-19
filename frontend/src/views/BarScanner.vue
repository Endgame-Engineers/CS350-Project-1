<template>
    <div class="video-container">
        <video ref="webCam" autoplay playsinline></video>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { barcodeReader } from '@/services/BarcodeScanner';
import router from '@/router';

export default {
    name: 'ScannerPage',
    
    setup() {
        const webCam = ref<HTMLVideoElement | null>(null);
        let selectedDeviceId = ref<string | null>(null);
        const barCodeNum = null as null | string;
        let stream = ref<MediaStream | null>(null);

        onMounted(async () => {
            const initialStream = await navigator.mediaDevices.getUserMedia({ video: true });
            selectedDeviceId.value = await checkForBackCamera();
            console.log(selectedDeviceId.value);
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
                        webCam.value.srcObject = stream.value;
                        const barCodeNum = await barcodeReader(webCam.value, selectedDeviceId.value)
                        if (barCodeNum) {
                            
                            router.push({ path: '/Search', query: { string: barCodeNum } });
                        }
                    }
                } catch (error) {
                    console.error(error);
                    router.push('/');
                }
            });

            onUnmounted(()=>{
                if(stream.value){
                    stream.value.getTracks().forEach(track => track.stop());
                }
            });

        return {
            webCam,
            barCodeNum,
        };
    },
};
</script>