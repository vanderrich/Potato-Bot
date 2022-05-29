import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("skipto")
        .setDescription("Skip to a specific track in the queue, removing other tracks on the way.")
        .addIntegerOption(option => option
            .setName("index")
            .setDescription("The index of the track to skip to.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    execute(interaction: CommandInteraction, client: any) {
        const queue = client.player.getQueue(interaction.guild?.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
        let index = interaction.options.getInteger('index')
        if (!index) return interaction.reply(`${interaction.user}, You must specify an index. ❌`);
        index--;
        if (index < 0) interaction.reply("Index cant be a negative number! ❌");

        queue.skipTo(index);

        return interaction.reply(`Skipped tracks ✅`);
    },
};