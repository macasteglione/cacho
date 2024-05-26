import { Model } from "mongoose";
import { redis } from "../lib/redis";

export default async (key: string, query: any, schema: Model<any>) => {
    const cacheResult: any = await redis.get(key);

    if (cacheResult) return cacheResult;
    else {
        const fetchedObject = await schema.findOne(query);
        await redis.set(key, JSON.stringify(fetchedObject), { ex: 60 });

        return fetchedObject;
    }
};
