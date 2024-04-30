const { SlashCommandBuilder } = require("discord.js");
const Roulette = require("../../models/Roulette");

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
    run: async ({ interaction }) => {
        try {
            const QUERY = {
                guildId: interaction.guild.id,
            };
            const roulette = await Roulette.findOne(QUERY);
            const subcommand = interaction.options.getSubcommand();

            await interaction.deferReply();

            switch (subcommand) {
                case "random":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            ":x: There are no elements in the roulette."
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

                    if (!addElement)
                        return interaction.editReply(
                            ":x: Please provide a name for the element."
                        );

                    if (!roulette) {
                        const newRoulette = new Roulette({
                            guildId: interaction.guild.id,
                            items: [{ name: addElement }],
                        });

                        await newRoulette.save();

                        return interaction.editReply(
                            ":white_check_mark: **Roulette created!** Use `/roulette add` to add a new item to the list."
                        );
                    } else {
                        roulette.items.push({ name: addElement });

                        await roulette.save();

                        return interaction.editReply(
                            `:white_check_mark: **${addElement} added!**`
                        );
                    }

                case "remove":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            ":x: There are no elements in the roulette."
                        );

                    const removeElement =
                        interaction.options.getString("element");

                    if (!removeElement)
                        return interaction.editReply(
                            ":x: Please provide a name for the element."
                        );

                    const removeIndex = roulette.items.findIndex(
                        (item) => item.name === removeElement
                    );

                    if (removeIndex === -1)
                        return interaction.editReply(
                            ":x: The specified element is not found in the roulette."
                        );

                    roulette.items.splice(removeIndex, 1);

                    await roulette.save();

                    return interaction.editReply(
                        `:white_check_mark: **${removeElement} removed!**`
                    );

                case "clear":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            ":x: There are no elements in the roulette."
                        );

                    roulette.items = [];

                    await roulette.save();

                    return interaction.editReply(
                        `:white_check_mark: **Roulette cleared!** Use /roulette add to add a new item to the list.`
                    );

                case "show":
                    if (!roulette || roulette.items.length === 0)
                        return interaction.editReply(
                            ":x: There are no elements in the roulette."
                        );

                    return interaction.editReply(
                        `:game_die: **Roulette:**\n${roulette.items
                            .map((item, index) => `${index + 1}. ${item.name}`)
                            .join("\n")}`
                    );

                default:
                    return interaction.editReply(":x: Unknown subcommand.");
            }
        } catch (error) {
            console.log(`Error in roulette file: ${error}`);
            interaction.editReply(
                ":x: An error occurred while processing your request."
            );
        }
    },
};
