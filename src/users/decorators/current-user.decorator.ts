import {
    createParamDecorator,
    ExecutionContext
} from '@nestjs/common';

export const CurrentUser = createParamDecorator(
    // no arguments required to be sent to the decorator
    (data: never, context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        return req.currUser;
    }
)
