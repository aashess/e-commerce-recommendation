
import { createClient } from "redis";

export const redis = createClient({
    url: 'redis://127.0.0.1:6379'
});

redis.on('error', err => {
    console.error('Redis error: ', err);
    
})

await redis.connect()

