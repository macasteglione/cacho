import { Model } from "mongoose";
import { redis } from "../lib/redis";

export default async (
    key: string,
    query: any,
    schema: Model<any>,
    items?: string
): Promise<any> => {
    const cacheResult = await redis.get(key);

    if (cacheResult) return cacheResult;
    else {
        const fetchedObject = await schema.find(query).select(`-_id ${items}`);
        await redis.set(key, JSON.stringify(fetchedObject), { ex: 60 });

        return fetchedObject;
    }
};
