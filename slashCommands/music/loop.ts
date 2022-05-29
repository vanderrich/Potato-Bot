import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

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
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);
        const loop = interaction.options.getNumber("loop");
        queue.setRepeatMode(loop);
        interaction.reply(`${loop === 0 ? "Off" : loop === 1 ? "Looping track 🔂" : loop === 2 ? "Looping queue 🔁" : "Autoplaying 🔂"}`);
    }
}