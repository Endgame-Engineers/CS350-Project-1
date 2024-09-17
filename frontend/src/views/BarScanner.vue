<template>
    <div>
        <video ref="video" style="width: 100%;"></video>
    </div>
    <label for="camera-select">Select Camera:</label>
    <select id="camera-select" v-model="selectedDeviceId" @change="changeCamera">
        <option v-for="device in videoInputDevices" :key="device.deviceId" :value="device.deviceId">
            {{ device.label || `Camera ${device.deviceId}` }}
        </option>
    </select>
</template>

<script lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { BrowserMultiFormatReader } from '@zxing/library';
import { barcodeReader } from '@/services/BarcodeScanner';
import { useRouter } from 'vue-router';

export default {
    name: 'ScannerPage',
    setup() {
        const scannedInfo = ref(null);
        const videoRef = ref<HTMLVideoElement | null>(null);
        const router = useRouter();
        const codeReader = new BrowserMultiFormatReader();
        const videoInputDevices = ref<MediaDeviceInfo[]>([]);
        const error = ref<string>('');
        const selectedDeviceId = ref<string>('');  // Use ref for reactivity

        const listVideoInputDevices = async () => {
            try {
                // Request user media permission
                console.log("Requesting camera access...");
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (!videoRef.value) {
                    throw new Error("Video element is not available");
                }

                // Attach the video stream to the video element
                console.log("Attaching video stream...");
                videoRef.value.srcObject = stream;

                // List video input devices
                console.log("Listing video input devices...");
                const devices = await codeReader.listVideoInputDevices();
                videoInputDevices.value = devices;
                if (devices.length > 0) {
                    selectedDeviceId.value = devices[0].deviceId;  // Update ref value
                    codeReader.reset();
                }
            } catch (err) {
                console.error("Error accessing media devices:", err);
                error.value = "Could not access camera. Please check permissions.";
            }
        };

        async function loadCamera(videoRef: HTMLVideoElement | null, selectedDeviceId: string) {
            if (videoRef) {
                try {
                    const scannedInfo = await barcodeReader(videoRef, selectedDeviceId, codeReader);
                    if (scannedInfo) {
                        console.log("Scanned info:", scannedInfo);
                        router.push({ path: '/Search', query: { code: scannedInfo } });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }          
        
        async function changeCamera(event: Event) {
            const target = event.target as HTMLSelectElement;
            const selectedDeviceId = target.value;
            if (videoRef.value) {
                try {
                    const scannedInfo = await barcodeReader(videoRef.value, selectedDeviceId, codeReader);
                    if (scannedInfo) {
                        router.push({ path: '/Search', query: { code: scannedInfo } });
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        }

        onMounted(async () => {
            await nextTick();

            videoRef.value = document.querySelector('video');
            if (!videoRef.value) {
                console.error("Video element is not available.");
                return;
            }

            await listVideoInputDevices();
            await loadCamera(videoRef.value, selectedDeviceId.value);
        });

        return {
            scannedInfo, 
            videoRef, 
            videoInputDevices, 
            selectedDeviceId, 
            error, 
            codeReader, 
            changeCamera
        };
    }
};
</script>script