const { Redis } = require("ioredis");

const REDIS = new Redis(process.env.REDIS_URI);

module.exports = REDIS;
