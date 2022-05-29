import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("pause")
        .setDescription("Pause the current track"),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        const success = queue.setPaused(true);

        return interaction.reply(success ? `The currently playing music named **${queue.current.title}** has stopped ✅` : `${interaction.user}, Something went wrong. ❌`);
    },
};