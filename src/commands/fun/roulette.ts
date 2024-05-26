import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
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

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guild = interaction.guild!.id;
        const subcommand = interaction.options.getSubcommand();
        let roulette: any = await getCache(guild, { guildId: guild }, Roulette);

        switch (subcommand) {
            case "random":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        "There are no elements in the roulette."
                    );

                const randomIndex = Math.floor(
                    Math.random() * roulette.items.length
                );
                const randomElement = roulette.items[randomIndex].name;

                return interaction.editReply(
                    `:game_die: **Random element selected:** ${randomElement}`
                );

            case "add":
                const addElement = interaction.options.getString("element");

                if (!roulette) {
                    const newRoulette = new Roulette({
                        guildId: guild,
                        items: [{ name: addElement }],
                    });

                    await newRoulette.save();

                    return interaction.editReply(
                        `:white_check_mark: **Roulette created!** Use \`/roulette add\` to add a new item to the list.`
                    );
                } else {
                    roulette.items.push({ name: addElement });

                    save(roulette, guild);

                    return interaction.editReply(
                        `:white_check_mark: **${addElement} added!**`
                    );
                }

            case "remove":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        "There are no elements in the roulette."
                    );

                const removeElement = interaction.options.getString("element");

                const removeIndex = roulette.items.findIndex(
                    (item: any) => item.name === removeElement
                );

                if (removeIndex === -1)
                    return interaction.editReply(
                        "The specified element is not found in the roulette."
                    );

                roulette.items.splice(removeIndex, 1);

                save(roulette, guild);

                return interaction.editReply(
                    `:white_check_mark: **${removeElement} removed!**`
                );

            case "clear":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        "There are no elements in the roulette."
                    );

                roulette.items.splice(0, roulette.items.length);

                save(roulette, guild);

                return interaction.editReply(
                    `:white_check_mark: **Roulette cleared!** Use \`/roulette add\` to add a new item to the list.`
                );

            case "show":
                if (!roulette || roulette.items.length === 0)
                    return interaction.editReply(
                        "There are no elements in the roulette."
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
