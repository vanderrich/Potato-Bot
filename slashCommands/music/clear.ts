import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear the queue."),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, No music currently playing. ❌`);

        await queue.clear();

        interaction.reply(`The queue has just been cleared. 🗑️`);
    },
};