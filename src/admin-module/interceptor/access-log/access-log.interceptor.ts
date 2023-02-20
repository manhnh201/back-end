import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from "@nestjs/common";
import { IncomingMessage } from "http";
import { Observable } from "rxjs";

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
    private readonly log = new Logger(AccessLogInterceptor.name);

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request: IncomingMessage = context.switchToHttp().getRequest();
        

        return next.handle()
    }
}