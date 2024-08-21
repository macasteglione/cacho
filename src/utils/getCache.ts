import { FilterQuery, Model } from "mongoose";
import { redis } from "../lib/redis";

export default async (
    key: string,
    query: FilterQuery<any>,
    schema: Model<any>
): Promise<any> => {
    const cacheResult = await redis.get(key);

    if (cacheResult) return cacheResult;

    const fetchedObject = await schema.findOne(query);
    await redis.set(key, JSON.stringify(fetchedObject), { ex: 60 });

    return fetchedObject;
};
