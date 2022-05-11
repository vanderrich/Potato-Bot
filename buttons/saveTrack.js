module.exports = {
    name: "saveTrack",
    execute: (interaction, client, Discord, footers) => {
        const queue = client.player.getQueue(interaction.guildId);

        if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });

        const embed = new Discord.MessageEmbed()
            .setColor('BLUE')
            .setTitle(client.user.username + " - Save Track")
            .setThumbnail(client.user.displayAvatarURL())
            .addField(`Track`, `\`${queue.current.title}\``)
            .addField(`Duration`, `\`${queue.current.duration}\``)
            .addField(`URL`, `${queue.current.url}`)
            .addField(`Saved Server`, `\`${interaction.guild.name}\``)
            .addField(`Requested By`, `${queue.current.requestedBy}`)
            .setTimestamp()
            .setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
        interaction.member.send({ embeds: [embed] }).then(() => {
            return interaction.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true, components: [] });
        }).catch(error => {
            return interaction.reply({ content: `I can't send you a private message. ❌`, ephemeral: true, components: [] });
        });
    }
}