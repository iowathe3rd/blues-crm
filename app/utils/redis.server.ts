import Redis from "ioredis";

// @ts-ignore
export const redis = new Redis(process.env.REDIS_URL);
