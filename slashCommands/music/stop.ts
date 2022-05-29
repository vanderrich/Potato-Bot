import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("stop")
        .setDescription("Destroy the queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        queue.destroy();

        interaction.reply(`The music playing on this server has been turned off, see you next time ✅`);
    },
};