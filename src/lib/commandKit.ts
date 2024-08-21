import { CommandKit } from "commandkit";
import { BOT_CLIENT } from "./botClient";

export function initCommandKit() {
    new CommandKit({
        client: BOT_CLIENT,
        commandsPath: `${__dirname}/../commands`,
        eventsPath: `${__dirname}/../events`,
        skipBuiltInValidations: true,
        bulkRegister: true,
    });
}
