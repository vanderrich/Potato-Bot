import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("loop")
        .setDescription("Loop the track or queue")
        .addNumberOption(option =>
            option
                .setName("loop")
                .setDescription("The object to loop")
                .setRequired(true)
                .addChoices(
                    { name: "Off", value: 0 },
                    { name: "Track", value: 1 },
                    { name: "Queue", value: 2 },
                    { name: "Autoplay", value: 3 }
                )
        ),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        const queue = client.player.getQueue(interaction.guildId!);
        const loop = interaction.options.getNumber("loop");
        queue.setRepeatMode(loop!);
        interaction.reply(loop === 0 ? locale.loopType.off : loop === 1 ? locale.loopType.track : loop === 2 ? locale.loopType.queue : locale.loopType.autoplay);
    }
}