import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';

const mockReset = vi.fn();
const mockDecodeFromVideoDevice = vi.fn();

vi.mock('@zxing/library', () => ({
  BrowserMultiFormatReader: vi.fn(() => ({
    decodeFromVideoDevice: mockDecodeFromVideoDevice,
    reset: mockReset,
  })),
}));

import BarcodeScanner from '../../src/services/BarcodeScanner';

describe('BarcodeScanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call reset when closeBarcodeReader is invoked', async () => {
    await BarcodeScanner.closeBarcodeReader();
    expect(mockReset).toHaveBeenCalled();
  });

  it('should return a barcode result when a barcode is successfully scanned', async () => {
    const mockResult = { getText: vi.fn(() => '1234567890') };
    mockDecodeFromVideoDevice.mockImplementation((_deviceId, _video, callback) => {
      callback(mockResult, null);
    });

    const videoElement = document.createElement('video');
    const result = await BarcodeScanner.barcodeReader(videoElement, 'mockDeviceId');

    expect(result).toBe('1234567890');
    expect(mockDecodeFromVideoDevice).toHaveBeenCalledWith(
      'mockDeviceId',
      videoElement,
      expect.any(Function)
    );
    expect(mockDecodeFromVideoDevice).toHaveBeenCalledTimes(1);
    expect(mockReset).toHaveBeenCalled();
    expect(mockResult.getText).toHaveBeenCalled();
  });

  it('should throw an error when scanning fails', async () => {
    const mockError = new Error('Scanning failed');
    mockDecodeFromVideoDevice.mockImplementation((_deviceId, _video, callback) => {
      callback(null, mockError);
    });

    const videoElement = document.createElement('video');

    await expect(BarcodeScanner.barcodeReader(videoElement, 'mockDeviceId')).rejects.toThrow('Scanning failed');
    expect(mockDecodeFromVideoDevice).toHaveBeenCalledWith(
      'mockDeviceId',
      videoElement,
      expect.any(Function)
    );
    expect(mockDecodeFromVideoDevice).toHaveBeenCalledTimes(1);
    expect(mockReset).not.toHaveBeenCalled();
  });
});
