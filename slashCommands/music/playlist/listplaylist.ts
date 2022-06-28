import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Music } from "../../../localization";
import { Client, SlashCommand } from "../../../Util/types";


module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List all playlists."),
    category: "Music",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        await interaction.deferReply();
        const user = interaction.user;

        const playlists = await client.playlists.find({
            owner: user.id
        });

        if (playlists?.length == 0) return interaction.editReply(locale.noPlaylists);

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle(locale.yourPlaylists)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

        playlists.forEach((playlist: any) => {
            embed.addField(playlist.name, playlist.tracks.length + locale.tracks);
        });
        interaction.editReply({ embeds: [embed] });
    }
} as SlashCommand;