const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Shows a list of commands you can use."),
    run: ({ interaction, client }) => {
        const responseEmbed = new EmbedBuilder()
            .setColor("#db2473")
            .setDescription("Below you can see all the commands I know.")
            .setAuthor({
                name: "Hi! I'm Cacho!",
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
                url: "https://cacho.vercel.app/",
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: "Fun", value: "`roulette`" },
                {
                    name: "Misc",
                    value: "`pong`, `help`",
                },
                {
                    name: "Config",
                    value: "`language`",
                },
                {
                    name: "Economy",
                    value: "`level`",
                }
            );

        interaction.reply({ embeds: [responseEmbed] });
    },
};
