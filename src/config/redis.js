
import { createClient } from "redis";

export const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: 'redis-16092.crce283.ap-south-1-2.ec2.cloud.redislabs.com',
        port: 16092
    }
});

redis.on('error', err => {
    console.error('Redis error: ', err);
    
})





