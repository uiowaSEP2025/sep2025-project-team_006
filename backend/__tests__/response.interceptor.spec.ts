import { of } from 'rxjs';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { ResponseInterceptor } from 'src/config/response.interceptor';

describe('ResponseInterceptor', () => {
  let interceptor: ResponseInterceptor<any>;

  beforeEach(() => {
    interceptor = new ResponseInterceptor();
  });

  it('should wrap response payload in { success: true, payload: ... }', (done) => {
    const callHandler: CallHandler = {
      handle: () => of({ test: 'value' }),
    };

    const context = {} as ExecutionContext;

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({
        success: true,
        payload: { test: 'value' },
      });
      done();
    });
  });
});
