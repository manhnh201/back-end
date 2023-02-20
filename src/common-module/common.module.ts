import { CacheModule, Module } from '@nestjs/common';
import { JwtProvider } from './utils/auth-provider/jwt.provider';
import { RestTemplate } from './utils/rest-template/rest-template.utils';
import { LogProvider } from './utils/log-provider/log-provider';
import * as moment from 'moment';
import { MemCacheAdapter } from './utils/cache/mem-cache-adapter';

@Module({
    imports: [CacheModule.register()],
    providers: [
        JwtProvider, RestTemplate, LogProvider, MemCacheAdapter,
    ],
    exports: [JwtProvider, RestTemplate, LogProvider, MemCacheAdapter]
})
export class CommonModule {
    constructor() {
        Date.prototype.toJSON = function () {
            return moment(this).format();
        }
    }
}
