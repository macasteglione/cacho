import { redis } from "../lib/redis";
import { Model } from "mongoose";

export default async (
    key: string,
    schema: Model<any>,
    query: any,
    update: any,
    options: any
) => {
    let result = await schema.findOneAndUpdate(query, update, options);
    await redis.set(key, JSON.stringify(result), {
        ex: 60,
    });
};
