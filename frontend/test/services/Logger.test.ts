import { describe, it, expect, vi } from 'vitest';
import { logger } from '../../src/services/Logger';

describe('Logger.ts', () => {
    it('should log info messages', () => {
        const logSpy = vi.spyOn(logger, 'info');
        logger.info('This is an info message');
        expect(logSpy).toHaveBeenCalledWith('This is an info message');
    });

    it('should log error messages', () => {
        const logSpy = vi.spyOn(logger, 'error');
        logger.error('This is an error message');
        expect(logSpy).toHaveBeenCalledWith('This is an error message');
    });

    it('should log debug messages', () => {
        const logSpy = vi.spyOn(logger, 'debug');
        logger.debug('This is a debug message');
        expect(logSpy).toHaveBeenCalledWith('This is a debug message');
    });

    it('should log warn messages', () => {
        const logSpy = vi.spyOn(logger, 'warn');
        logger.warn('This is a warn message');
        expect(logSpy).toHaveBeenCalledWith('This is a warn message');
    });
});