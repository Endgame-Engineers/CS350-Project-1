<template>
    <div>
        <video ref="video" style="width: 100%;"></video>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import { barcodeReader } from '@/services/BarcodeScanner';
import { useRouter } from 'vue-router';

export default {
    name: 'ScannerPage',
    setup(){
        const scannedInfo = ref(null);
        const videoRef = ref<HTMLVideoElement | null>(null);
        const router = useRouter();
        onMounted(async () => {
            if(videoRef.value){
                try{
                    const scannedInfo = await barcodeReader(videoRef.value)
                    if(scannedInfo.value){
                        router.push({path: '/Search', query: { code: scannedInfo.value }});
                    }
                }catch(error){
                    console.error(error)
                }
            }
        });
        return{
            scannedInfo, videoRef
        }
    }
};
</script>

<style scoped>
</style>