import { SlashCommandBuilder } from "discord.js";
import { SlashCommandProps } from "commandkit";
import { Roulette } from "../../models/Roulette";
import getCache from "../../utils/getCache";
import showError from "../../utils/showError";
import saveCache from "../../utils/saveCache";

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

async function getRoulette(userId: string, guildId: string) {
    return await getCache(
        `roulette:${userId}:${guildId}`,
        { guildId: guildId },
        Roulette
    );
}

async function saveRoulette(userId: string, guildId: string, items: any[]) {
    await saveCache(
        `roulette:${userId}:${guildId}`,
        Roulette,
        { guildId: guildId },
        { items },
        { new: true }
    );
}

async function handleRandom(interaction: any, roulette: any) {
    if (!roulette || roulette.items.length === 0)
        return interaction.editReply("There are no elements in the roulette.");

    const randomIndex = Math.floor(Math.random() * roulette.items.length);
    const randomElement = roulette.items[randomIndex].name;

    return interaction.editReply(
        `:game_die: **Random element selected:** ${randomElement}`
    );
}

async function handleAdd(interaction: any, roulette: any, guildId: string) {
    const addElement = interaction.options.getString("element");

    if (!roulette) {
        const newRoulette = new Roulette({
            guildId,
            items: [{ name: addElement }],
        });

        await newRoulette.save();
        return interaction.editReply(
            `:white_check_mark: **Roulette created!** Use \`/roulette add\` to add a new item to the list.`
        );
    } else {
        roulette.items.push({ name: addElement });
        await saveRoulette(interaction.user.id, guildId, roulette.items);

        return interaction.editReply(
            `:white_check_mark: **${addElement} added!**`
        );
    }
}

async function handleRemove(interaction: any, roulette: any, guildId: string) {
    if (!roulette || roulette.items.length === 0)
        return interaction.editReply("There are no elements in the roulette.");

    const removeElement = interaction.options.getString("element");
    const removeIndex = roulette.items.findIndex(
        (item: any) => item.name === removeElement
    );

    if (removeIndex === -1)
        return interaction.editReply(
            "The specified element is not found in the roulette."
        );

    roulette.items.splice(removeIndex, 1);
    await saveRoulette(interaction.user.id, guildId, roulette.items);

    return interaction.editReply(
        `:white_check_mark: **${removeElement} removed!**`
    );
}

async function handleClear(interaction: any, roulette: any, guildId: string) {
    if (!roulette || roulette.items.length === 0)
        return interaction.editReply("There are no elements in the roulette.");

    roulette.items.splice(0, roulette.items.length);
    await saveRoulette(interaction.user.id, guildId, roulette.items);

    return interaction.editReply(
        `:white_check_mark: **Roulette cleared!** Use \`/roulette add\` to add a new item to the list.`
    );
}

async function handleShow(interaction: any, roulette: any) {
    if (!roulette || roulette.items.length === 0)
        return interaction.editReply("There are no elements in the roulette.");

    return interaction.editReply(
        `:game_die: **Roulette:**\n${roulette.items
            .map((item: any, index: any) => `${index + 1}. ${item.name}`)
            .join("\n")}`
    );
}

export async function run({ interaction, client }: SlashCommandProps) {
    await interaction.deferReply();

    if (!interaction.inGuild())
        return interaction.editReply(
            ":x: **This command only works on guilds.**"
        );

    try {
        const guildId = interaction.guild!.id;
        const roulette = await getRoulette(interaction.user.id, guildId);

        switch (interaction.options.getSubcommand()) {
            case "random":
                await handleRandom(interaction, roulette);
                break;

            case "add":
                await handleAdd(interaction, roulette, guildId);
                break;

            case "remove":
                await handleRemove(interaction, roulette, guildId);
                break;

            case "clear":
                await handleClear(interaction, roulette, guildId);
                break;

            case "show":
                await handleShow(interaction, roulette);
                break;
        }
    } catch (error) {
        showError("roulette", error, interaction);
    }
}
