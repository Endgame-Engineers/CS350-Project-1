import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { checkForBackCamera } from '../../src/services/CheckForBackCamera';

describe('checkForBackCamera', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    Object.defineProperty(navigator, 'mediaDevices', {
      value: {
        enumerateDevices: vi.fn(),
      },
      writable: true,
    });
  });

  it('should return the device ID of the back camera when found', async () => {
    (navigator.mediaDevices.enumerateDevices as Mock).mockResolvedValue([
      { kind: 'videoinput', label: 'Front Camera', deviceId: 'front-123' },
      { kind: 'videoinput', label: 'Back Camera', deviceId: 'back-456' },
    ]);

    const result = await checkForBackCamera();

    expect(result).toBe('back-456');
    expect(navigator.mediaDevices.enumerateDevices).toHaveBeenCalled();
  });

  it('should return null when no back camera is found', async () => {
    (navigator.mediaDevices.enumerateDevices as Mock).mockResolvedValue([
      { kind: 'videoinput', label: 'Front Camera', deviceId: 'front-123' },
    ]);

    const result = await checkForBackCamera();

    expect(result).toBeNull();
    expect(navigator.mediaDevices.enumerateDevices).toHaveBeenCalled();
  });

  it('should return null and log an error if enumerateDevices fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (navigator.mediaDevices.enumerateDevices as Mock).mockRejectedValue(
      new Error('Access denied')
    );

    const result = await checkForBackCamera();

    expect(result).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error accessing media devices:', expect.any(Error));
  });
});
