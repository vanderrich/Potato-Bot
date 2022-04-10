const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("queue")
        .setDescription("See the current queue"),
    execute(interaction, client, Discord) {
        const queue = client.player.getQueue(interaction.guild.id);

        if (!queue || !queue.playing) return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);

        if (!queue.tracks[0]) return interaction.reply(`${interaction.user}, No music in queue after current. ❌`);

        const embed = new Discord.MessageEmbed();
        const methods = ['🔁', '🔂'];

        embed.setColor('RANDOM');
        embed.setThumbnail(interaction.guild.iconURL({ size: 2048, dynamic: true }));
        embed.setTitle(`Server Music List - ${interaction.guild.name} ${methods[queue.repeatMode]}`);

        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (Started by <@${track.requestedBy.id}>)`);

        // const songs = queue.tracks.length;
        // const nextSongs = songs > 5 ? `And **${songs - 5}** Other Song...` : `There are **${songs}** Songs in the List.`;

        // embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`);
        embed.setDescription(`Currently Playing: \`${queue.current.title}\`\n\n${tracks.join('\n')}`);

        embed.setTimestamp();
        embed.setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.avatarURL({ dynamic: true }) });

        // const row = new Discord.MessageActionRow()
        //     .addComponents(
        //         new Discord.MessageButton()
        //             .setCustomId('first')
        //             .setLabel('⏮')
        //             .setStyle('PRIMARY'),
        //         new Discord.MessageButton()
        //             .setCustomId('back')
        //             .setLabel('◀️')
        //             .setStyle('PRIMARY'),
        //         new Discord.MessageButton()
        //             .setCustomId('next')
        //             .setLabel('▶️')
        //             .setStyle('PRIMARY'),
        //         new Discord.MessageButton()
        //             .setCustomId('last')
        //             .setLabel('⏭')
        //             .setStyle('PRIMARY'),
        //     );

        // interaction.reply({ embeds: [embed], components: [row] });
        interaction.reply({ embeds: [embed] });
    },
};