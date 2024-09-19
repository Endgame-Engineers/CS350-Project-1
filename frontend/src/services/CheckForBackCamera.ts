export async function checkForBackCamera(): Promise<string | null> {
    try {

        const devicesAvailable = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devicesAvailable.filter((device) => device.kind === 'videoinput');

        const backCamera = videoDevices.find((device) =>
            device.label.toLowerCase().includes('back') ||
            device.label.toLowerCase().includes('environment')
        );

        if(backCamera){
            console.log('Back camera found:');
            return backCamera.deviceId;
        }
        console.log('No Back camera found');
        return null;
    } catch(error) {
        console.error('Error accessing media devices:', error)
        return null;
    }
}