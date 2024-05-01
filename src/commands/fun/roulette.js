const { SlashCommandBuilder } = require("discord.js");
const Roulette = require("../../models/Roulette");
const getLanguages = require("../../utils/getLanguages");

module.exports = {
    data: new SlashCommandBuilder()
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
        ),
    run: async ({ interaction, client }) => {
        try {
            const serverLanguage = await getLanguages(client);
            const guild = interaction.guild.id;
            const QUERY = {
                guildId: guild,
            };
            const roulette = await Roulette.findOne(QUERY);
            const subcommand = interaction.options.getSubcommand();

            await interaction.deferReply();

            switch (subcommand) {
                case "random":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.noElements
                            )
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
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.proviceElementError
                            )
                        );

                    if (!roulette) {
                        const newRoulette = new Roulette({
                            guildId: guild,
                            items: [{ name: addElement }],
                        });

                        await newRoulette.save();

                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.rouletteCreated
                            )
                        );
                    } else {
                        roulette.items.push({ name: addElement });

                        await roulette.save();

                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.elementAdded
                            )
                        );
                    }

                case "remove":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.noElements
                            )
                        );

                    const removeElement =
                        interaction.options.getString("element");

                    if (!removeElement)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.proviceElementError
                            )
                        );

                    const removeIndex = roulette.items.findIndex(
                        (item) => item.name === removeElement
                    );

                    if (removeIndex === -1)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.elementNotFound
                            )
                        );

                    roulette.items.splice(removeIndex, 1);

                    await roulette.save();

                    return interaction.editReply(
                        eval(
                            serverLanguage[guild].translation.commands.roulette
                                .elementRemoved
                        )
                    );

                case "clear":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.noElements
                            )
                        );

                    roulette.items = [];

                    await roulette.save();

                    return interaction.editReply(
                        eval(
                            serverLanguage[guild].translation.commands.roulette
                                .rouletteCleared
                        )
                    );

                case "show":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            eval(
                                serverLanguage[guild].translation.commands
                                    .roulette.noElements
                            )
                        );

                    return interaction.editReply(
                        `:game_die: **Roulette:**\n${roulette.items
                            .map((item, index) => `${index + 1}. ${item.name}`)
                            .join("\n")}`
                    );

                default:
                    return interaction.editReply(
                        eval(
                            serverLanguage[guild].translation.commands
                                .unknownCommand
                        )
                    );
            }
        } catch (error) {
            console.log(`Error in roulette file: ${error}`);
            interaction.reply(
                `:x: An error occurred while processing your request: \`${error}\``
            );
        }
    },
};
