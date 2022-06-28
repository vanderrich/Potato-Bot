
import Discord from "discord.js";
import { Music } from "../../localization";
import { Client } from "../../Util/types";


module.exports = {
    name: "saveTrack",
    execute: (interaction: Discord.ButtonInteraction, client: Client, footers: string[]) => {
        const queue = client.player.getQueue(interaction.guildId!);
        const locale = client.getLocale(interaction, "commands.music") as Music
        if (!queue || !queue.playing) return interaction.reply({ content: locale.noMusicPlaying, ephemeral: true, components: [] });

        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle(locale.saveTrack)
            .setThumbnail(client.user?.displayAvatarURL()!)
            .addField(locale.track, `\`${queue.current.title}\``)
            .addField(locale.duration, `\`${queue.current.duration}\``)
            .addField(locale.url, `${queue.current.url}`)
            .addField(locale.saveServer, `\`${interaction.guild?.name}\``)
            .addField(locale.requestedBy, `${queue.current.requestedBy}`)
            .setTimestamp()
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.user.send({ embeds: [embed] }).then(() => {
            return interaction.reply({ content: locale.saveSuccess, ephemeral: true, components: [] });
        }).catch(error => {
            return interaction.reply({ content: locale.cantDM, ephemeral: true, components: [] });
        });
    }
}