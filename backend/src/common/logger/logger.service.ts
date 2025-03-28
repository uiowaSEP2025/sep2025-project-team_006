import { ConsoleLogger, Injectable } from '@nestjs/common';

/**
 * The logger service implements custom logging methods that are passed into the NestJS app.
 */

@Injectable()
export class LoggerService extends ConsoleLogger {
  /* eslint-disable @typescript-eslint/no-unsafe-argument */
  private readonly isDev = process.env.NODE_ENV === 'development';

  /** Write a 'error' level log. */
  error(message: any, ...optionalParams: any[]) {
    if (this.isDev) super.error(message, ...optionalParams);
  }

  /** Write a 'debug' level log. */
  debug(message: any, ...optionalParams: any[]) {
    if (this.isDev) super.debug(message, ...optionalParams);
  }

  /** Write a 'verbose' level log. */
  verbose(message: any, ...optionalParams: any[]) {
    if (this.isDev) super.verbose(message, ...optionalParams);
  }
}
