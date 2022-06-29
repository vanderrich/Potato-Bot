import { SlashCommandSubcommandBuilder } from '@discordjs/builders';
import { QueryType } from 'discord-player';
import { CommandInteraction, GuildMember, Message, MessageActionRow, MessageButton, ButtonInteraction } from 'discord.js';
import { Music } from '../../localization';
import { Client } from '../../Util/types';

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName('play')
        .setDescription('Play a track.')
        .addStringOption(option => option
            .setName('track')
            .setDescription('The url or query of the track to play.')
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName('index')
            .setDescription('The index of the track to play.')
            .setRequired(false)
        ),
    category: 'Music',
    isSubcommand: true,
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[], locale: Music) {
        let member = interaction.member;
        if (!(member instanceof GuildMember)) member = await interaction.guild!.members.fetch(interaction.user.id);
        await interaction.deferReply()
        const res = await client.player.search(interaction.options.getString('track')!, {
            requestedBy: member,
            searchEngine: QueryType.AUTO
        });
        let run = true;
        if (res.tracks[0].source != 'youtube') {
            const actionRow = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId("play")
                        .setEmoji("✅"),
                    new MessageButton()
                        .setCustomId("cancel")
                        .setEmoji("❎")
                );
            await interaction.editReply({ content: locale.areYouSurePlayNotYT, components: [actionRow] }).then(async (msg: any) => {
                if (!(msg instanceof Message)) msg = await interaction.channel!.messages.fetch(msg.id);
                const collector = msg.createMessageComponentCollector({ componentType: "BUTTON" });
                collector.on("collect", (button: ButtonInteraction) => {
                    if (button.customId === "play") {
                        run = true;
                    } else {
                        run = false;
                        button.reply(locale.cancel);
                    }
                });
                collector.on("end", () => {
                    run = false;
                    interaction.editReply(locale.timeout);
                })
            });
        }
        if (!run) return;

        let index = interaction.options.getInteger('index');

        if (!res || !res.tracks.length) return interaction.editReply(locale.noResults);

        const queue = await client.player.createQueue(interaction.guild!, {
            metadata: interaction.channel,
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 10000,
            autoSelfDeaf: true,
            initialVolume: 75
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel!);
        } catch {
            await client.player.deleteQueue(interaction.guild!.id);
            return interaction.editReply(locale.cantJoin);
        }


        res.playlist ? queue.addTracks(res.tracks) : index ? queue.insert(res.tracks[0], index - 1) : queue.addTrack(res.tracks[0]);

        if (!queue.playing) await queue.play();

        interaction.editReply(client.getLocale(interaction, "commands.music.playSuccess", res.playlist ? locale.track : locale.playlist));
    }
}