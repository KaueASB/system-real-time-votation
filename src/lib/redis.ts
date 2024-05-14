import { Redis } from "ioredis";

export let redis: Redis

function connRedis() {

  if(process.env.REDIS_SERVICE) {
    return redis = new Redis(process.env.REDIS_SERVICE)
  }
  
  return redis = new Redis()
}

connRedis()