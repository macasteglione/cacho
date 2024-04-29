const { devs, testServer } = require("../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const LOCAL_COMMANDS = getLocalCommands();

    try {
        const COMMAND_OBJECT = LOCAL_COMMANDS.find(
            (cmd) => cmd.name === interaction.commandName
        );

        if (!COMMAND_OBJECT) return;

        if (COMMAND_OBJECT.devOnly)
            if (!devs.includes(interaction.member.id)) {
                interaction.reply({
                    content: "Only developers are allowed to run this command",
                    ephemeral: true,
                });
                return;
            }

        if (COMMAND_OBJECT.testOnly)
            if (!(interaction.guild.id === testServer)) {
                interaction.reply({
                    content: "This command cannot be ran here.",
                    ephemeral: true,
                });
                return;
            }

        if (COMMAND_OBJECT.permissionsRequired?.length)
            for (const permission of COMMAND_OBJECT.permissionsRequired)
                if (!interaction.member.permissions.has(permission)) {
                    interaction.reply({
                        content: "Not enought permissions.",
                        ephemeral: true,
                    });
                    return;
                }

        if (COMMAND_OBJECT.botPermissions?.length)
            for (const permission of COMMAND_OBJECT.botPermissions) {
                const BOT = interaction.guild.members.me;

                if (!BOT.permissions.has(permission)) {
                    interaction.reply({
                        content: "I dont have enought permissions.",
                        ephemeral: true,
                    });
                    return;
                }
            }

        await COMMAND_OBJECT.callback(client, interaction);
    } catch (error) {
        console.log(`There was an error running this command: ${error}`);
    }
};
