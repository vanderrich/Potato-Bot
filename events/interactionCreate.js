const { prefix, footers, admins } = require('./../config.json')
const Discord = require('discord.js')
const queue = new Map()
module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isCommand()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            if (command.permissions) {
                if ((command.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) && !interaction.member.permissions.has(command.permissions)) return interaction.reply("You don't have permission to use this command!");
            }

            try {
                try {
                    if (interaction.options.getSubcommand()) {
                        const subcommand = client.slashCommands.get(interaction.options.getSubcommand());
                        try {
                            await subcommand.execute(interaction, client, Discord, footers)
                        }
                        catch (err) {
                            console.log(err)
                        }
                    }
                }
                catch (err) {
                    await command.execute(interaction, client, Discord, footers);
                }
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
        else if (interaction.isButton()) {
            const queue = client.player.getQueue(interaction.guildId);
            switch (interaction.customId) {
                case 'saveTrack': {
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
                    break
                case 'time': {
                    if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });

                    const progress = queue.createProgressBar();
                    const timestamp = queue.getPlayerTimestamp();

                    if (timestamp.progress == 'Infinity') return interaction.message.edit({ content: `This song is live streaming, no duration data to display. 🎧` });

                    const embed = new Discord.MessageEmbed()
                        .setColor('BLUE')
                        .setTitle(queue.current.title)
                        .setThumbnail(client.user.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`${progress} (**${timestamp.progress}**%)`)
                        .setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                    interaction.message.edit({ embeds: [embed] });
                    interaction.reply({ content: `**✅ Success:** Time data updated. `, ephemeral: true });
                }
            }
        }
    }
}