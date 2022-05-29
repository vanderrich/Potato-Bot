import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("delete")
        .setDescription("Delete a playlist.")
        .addStringOption(option => option
            .setName("name")
            .setDescription("The name of the playlist, case sensitive.")
            .setRequired(true)
        ),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        let name = interaction.options.getString("name");
        const deleted = await client.playlists.deleteOne({
            creator: interaction.user.id,
            name: name
        });
        if (deleted.deletedCount === 0) return interaction.reply("I couldn't find that playlist!");
        interaction.reply(`Successfully deleted playlist **${name}**.`);
    }
}