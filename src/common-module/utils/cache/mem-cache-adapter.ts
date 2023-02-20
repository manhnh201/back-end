import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { ICacheAdapter } from "./i-cache-adapter";
import { Cache } from "cache-manager";

@Injectable()
export class MemCacheAdapter implements ICacheAdapter {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) { }

    get<T>(key: string): Promise<T> {
        return this.cacheManager.get<T>(key)
    }

    set(key: string, value: any, ttl?: number): Promise<void> {
        ttl = ttl || 60000;
        return this.cacheManager.set(key, value, ttl)
    }

    del(key: string): Promise<void> {
        return this.cacheManager.del(key);
    }

    reset(): Promise<void> {
        return this.cacheManager.reset();
    }

    wrap<T>(key: string, closure: () => Promise<T>, ttl?: number): Promise<T> {
        ttl = ttl || 60000;
        return this.cacheManager.wrap(key, closure, ttl)
    }
}