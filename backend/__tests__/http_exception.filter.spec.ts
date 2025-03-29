import { HttpException, HttpStatus } from '@nestjs/common';
import { LoggerService } from 'src/common/logger/logger.service';
import { HttpExceptionFilter } from 'src/config/http_exception.filter';

describe('HttpExceptionFilter', () => {
  let filter: HttpExceptionFilter;
  let loggerMock: any;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let responseMock: any;
  let requestMock: any;
  let hostMock: any;

  beforeEach(() => {
    loggerMock = {
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
    };
    filter = new HttpExceptionFilter(loggerMock as LoggerService);
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ json: jsonMock });
    responseMock = { status: statusMock };
    requestMock = { url: '/api/faculty/metrics/1' };
    hostMock = {
      switchToHttp: () => ({
        getResponse: () => responseMock,
        getRequest: () => requestMock,
      }),
    };
  });

  it('should format the error response correctly for HttpException', () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);

    filter.catch(exception, hostMock as any);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.NOT_FOUND);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.anything(),
        timestamp: expect.any(String),
        path: requestMock.url,
      }),
    );
  });

  it('should handle non-HttpException errors as INTERNAL_SERVER_ERROR', () => {
    const exception = new Error('Unexpected error');

    filter.catch(exception, hostMock as any);

    expect(statusMock).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(jsonMock).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: exception,
        timestamp: expect.any(String),
        path: requestMock.url,
      }),
    );
  });

  it('should log error when NODE_ENV is not "test"', () => {
    // Save the original NODE_ENV value and set it to something else
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const exception = new HttpException('Test error', HttpStatus.BAD_REQUEST);
    filter.catch(exception, hostMock as any);

    expect(loggerMock.error).toHaveBeenCalledWith('HTTP Exception caught!', exception);

    // Restore the original NODE_ENV
    process.env.NODE_ENV = originalEnv;
  });
});
