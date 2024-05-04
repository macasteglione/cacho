import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import getLanguages from "../../utils/getLanguages";
import { Roulette } from "../../models/Roulette";
import { redis } from "../../lib/redis";
import getCache from "../../utils/getCache";
import showError from "../../utils/showError";

async function save(roulette: any, guild: any) {
    roulette = await Roulette.findOneAndUpdate(
        { guildId: guild },
        { items: roulette.items },
        { new: true }
    );
    await redis.set(guild, JSON.stringify(roulette), {
        ex: 60,
    });
}

export const data = new SlashCommandBuilder()
    .setName("roulette")
    .setDescription("Creates a roulette, and play with it!")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("add")
            .setDescription("Adds an element to the roulette.")
            .addStringOption((option) =>
                option
                    .setName("element")
                    .setDescription("The name of the element to add.")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("remove")
            .setDescription("Removes an element from the roulette.")
            .addStringOption((option) =>
                option
                    .setName("element")
                    .setDescription("The element of the element to remove.")
                    .setRequired(true)
            )
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("random")
            .setDescription("Selects a random element from the roulette.")
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("clear").setDescription("Clears the roulette.")
    )
    .addSubcommand((subcommand) =>
        subcommand.setName("show").setDescription("Shows the roulette.")
    );

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    try {
        const guild = interaction.guild!.id;
        const serverLanguage = await getLanguages(client);
        const subcommand = interaction.options.getSubcommand();
        let roulette: any = await getCache(guild, { guildId: guild }, Roulette);

        switch (subcommand) {
            case "random":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .noElements
                    );

                const randomIndex = Math.floor(
                    Math.random() * roulette.items.length
                );
                const randomElement = roulette.items[randomIndex].name;

                return interaction.editReply(
                    eval(
                        serverLanguage[guild].translation.commands.roulette
                            .randomElement
                    )
                );

            case "add":
                const addElement = interaction.options.getString("element");

                if (!addElement)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .proviceElementError
                    );

                if (!roulette) {
                    const newRoulette = new Roulette({
                        guildId: guild,
                        items: [{ name: addElement }],
                    });

                    await newRoulette.save();

                    return interaction.editReply(
                        eval(
                            serverLanguage[guild].translation.commands.roulette
                                .rouletteCreated
                        )
                    );
                } else {
                    roulette.items.push({ name: addElement });

                    save(roulette, guild);

                    return interaction.editReply(
                        eval(
                            serverLanguage[guild].translation.commands.roulette
                                .elementAdded
                        )
                    );
                }

            case "remove":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .noElements
                    );

                const removeElement = interaction.options.getString("element");

                if (!removeElement)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .proviceElementError
                    );

                const removeIndex = roulette.items.findIndex(
                    (item: any) => item.name === removeElement
                );

                if (removeIndex === -1)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .elementNotFound
                    );

                roulette.items.splice(removeIndex, 1);

                save(roulette, guild);

                return interaction.editReply(
                    eval(
                        serverLanguage[guild].translation.commands.roulette
                            .elementRemoved
                    )
                );

            case "clear":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .noElements
                    );

                roulette.items.splice(0, roulette.items.length);

                save(roulette, guild);

                return interaction.editReply(
                    eval(
                        serverLanguage[guild].translation.commands.roulette
                            .rouletteCleared
                    )
                );

            case "show":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        serverLanguage[guild].translation.commands.roulette
                            .noElements
                    );

                return interaction.editReply(
                    `:game_die: **Roulette:**\n${roulette.items
                        .map(
                            (item: any, index: any) =>
                                `${index + 1}. ${item.name}`
                        )
                        .join("\n")}`
                );
        }
    } catch (error) {
        showError("roulette", error, interaction);
    }
}
