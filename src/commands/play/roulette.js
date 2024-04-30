const { SlashCommandBuilder } = require("discord.js");
const Roulette = require("../../models/Roulette");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Creates a roulette, and play with it!")
        .addStringOption((option) =>
            option
                .setName("add")
                .setDescription("Adds an element to the roulette.")
        ),
    run: async ({ interaction, client }) => {
        interaction.reply(
            ":rolling_eyes: **This commands is not implemented yet.**"
        );

        /*
        const QUERY = {
            guildId: interaction.guild.id,
        };

        await interaction.deferReply();

        try {
            const ROULETTE = await Roulette.findOne(QUERY);

            if (ROULETTE) {
                await ROULETTE.save().catch((error) => {
                    console.log(`Error saving updated roulette: ${error}`);
                });
            } else {
                const NEW_ROULETTE = Roulette({
                    guildId: interaction.guild.id,
                    items: [],
                });

                await NEW_ROULETTE.save();

                interaction.editReply(
                    ":white_check_mark: **Roulette created!** Use `/roulette add` to add a new item to the list."
                );
            }
        } catch (error) {
            console.log(`Error in roulette file: ${error}`);
        }
        */
    },
};
