import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";


module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List all playlists."),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const user = interaction.user;

        const playlists = await client.playlists.find({
            owner: user.id
        });

        if (playlists?.length == 0) return interaction.reply("You don't have any playlists!");

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("Your playlists")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

        playlists.forEach((playlist: any) => {
            embed.addField(playlist.name, playlist.tracks.length + " tracks");
        });
        interaction.reply({ embeds: [embed] });
    }
}