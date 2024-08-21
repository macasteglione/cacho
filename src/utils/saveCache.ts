import { UpdateFilter } from "mongodb";
import { redis } from "../lib/redis";
import { FilterQuery, Model, QueryOptions } from "mongoose";

export default async (
    key: string,
    schema: Model<any>,
    query: FilterQuery<any>,
    update: UpdateFilter<any>,
    options: QueryOptions<any>
) => {
    let result = await schema.findOneAndUpdate(query, update, options);
    await redis.set(key, JSON.stringify(result), {
        ex: 60,
    });
};
