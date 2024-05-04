import { CommandInteraction } from "discord.js";

export default (
    file: string,
    error: unknown,
    interaction: CommandInteraction
) => {
    console.log(`Error in ${file} file: ${error}`);
    interaction.editReply(
        `An error occurred while processing your request: \`${error}\``
    );
};
