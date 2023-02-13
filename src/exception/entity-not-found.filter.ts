import { Catch } from '@nestjs/common';
import { EntityNotFoundException } from './entity-not-found.exception';

@Catch(EntityNotFoundException)
export class EntityNotFoundFilter {
  catch(exception, host) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = 404;

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      error: 'Not Found',
    });
  }
}
