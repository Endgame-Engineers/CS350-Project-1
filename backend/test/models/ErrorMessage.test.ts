// TODO: Daniel
import { ErrorMessage } from '../../src/models/ErrorMessage';

describe('ErrorMessage Model', () => {
  let errorMessage: ErrorMessage;

  beforeEach(() => {
    // create a mock ErrorMessage object before each test
    errorMessage = {
      message: 'An error occurred',
      type: 'error',
    };
  });

  it('should correctly initialize an ErrorMessage object', () => {
    expect(errorMessage).toBeDefined();
    expect(errorMessage.message).toBe('An error occurred');
    expect(errorMessage.type).toBe('error');
  });

  it('should allow updating the message property', () => {
    errorMessage.message = 'New error message';
    expect(errorMessage.message).toBe('New error message');
  });

  it('should allow updating the type property', () => {
    errorMessage.type = 'warning';
    expect(errorMessage.type).toBe('warning');
  });

  it('should validate the type is one of expected values', () => {
    const validTypes = ['error', 'warning', 'info', 'success'];
    expect(validTypes).toContain(errorMessage.type);

    errorMessage.type = 'info';
    expect(validTypes).toContain(errorMessage.type);

    errorMessage.type = 'success';
    expect(validTypes).toContain(errorMessage.type);
  });

  it('should handle an ErrorMessage with an empty message', () => {
    errorMessage.message = '';
    expect(errorMessage.message).toBe('');
  });

  it('should handle an ErrorMessage with a null type gracefully', () => {
    errorMessage.type = null as unknown as string; // simulating a type error
    expect(errorMessage.type).toBeNull();
  });
});

describe('ErrorMessage Model', () => {
    let errorMessage: ErrorMessage;

    beforeEach(() => {
        errorMessage = {
            message: 'A really really bad error occurred',
            type: 'error OMG',
        };
        });

    it('should correctly initialize an ErrorMessage object even with silly name', () => {
        expect(errorMessage).toBeDefined();
        expect(errorMessage.message).toBe('A really really bad error occurred');
        expect(errorMessage.type).toBe('error OMG');
    }
    );
    });