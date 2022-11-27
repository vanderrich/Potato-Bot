import { SlashCommandBuilder } from "@discordjs/builders";
import { Formatters, Message, MessageEmbed } from "discord.js";
import ms from "ms";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Make the bot send a poll")
        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("The title of the poll")
                .setRequired(true),
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("The duration the poll will last")
                .setRequired(true),
        )
        .addBooleanOption(option =>
            option
                .setName("ping")
                .setDescription("Should i ping everyone")
        )
        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("The description of the poll"),
        )
        .addStringOption(option => option.setName("option1").setDescription("The first option of the poll"))
        .addStringOption(option => option.setName("option2").setDescription("The second option of the poll"))
        .addStringOption(option => option.setName("option3").setDescription("The third option of the poll"))
        .addStringOption(option => option.setName("option4").setDescription("The fourth option of the poll"))
        .addStringOption(option => option.setName("option5").setDescription("The fifth option of the poll"))
        .addStringOption(option => option.setName("option6").setDescription("The sixth option of the poll"))
        .addStringOption(option => option.setName("option7").setDescription("The seventh option of the poll"))
        .addStringOption(option => option.setName("option8").setDescription("The eighth option of the poll")) as SlashCommandBuilder,
    category: "Fun",
    async execute(interaction, client, footers) {
        const title = interaction.options.getString("title");
        const description = interaction.options.getString("description");
        const options = [];
        const time = new Date(Date.now() + ms(interaction.options.getString("duration")));
        const ping = interaction.options.getBoolean("ping") || false;
        if (!ms(interaction.options.getString("duration"))) return interaction.reply(client.getLocale(interaction, "commands.poll.invalidDuration"));
        for (let i = 1; i <= 25; i++) {
            if (interaction.options.getString("option" + i) != null) {
                options.push(interaction.options.getString("option" + i));
            }
        }
        const timestamp = client.getLocale(interaction, "commands.info.poll.embedDesc", Formatters.time(time, 'R'))

        if (options.length < 1) {
            const embed = new MessageEmbed()
                .setTitle('📊 ' + title)
                .setColor('RANDOM')
                .setDescription(timestamp)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            if (description != null) embed.setDescription(description + '\n\n' + timestamp);

            interaction.reply({ content: ping ? '@everyone' : client.getLocale(interaction, "commands.info.poll.newPoll"), embeds: [embed], fetchReply: true }).then(async (msg) => {
                if (!(msg instanceof Message)) msg = await interaction.channel!.messages.fetch(msg.id)
                msg.react('👍');
                msg.react('👎');
            });
        }

        else {
            const embed = new MessageEmbed();

            const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
                '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];

            const arr: string[] = [];

            let count = 0;

            options.forEach(option => {
                arr.push(alphabet[count] + ' ' + option);
                count++;
            });

            embed
                .setTitle('📊 ' + title)
                .setColor('RANDOM')
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            if (description != null) embed.setDescription(description + '\n\n' + arr.join('\n\n') + `\n\n${timestamp}`);
            else embed.setDescription(arr.join('\n\n')) + `\n\n${timestamp}`;

            interaction.reply({ content: ping ? '@everyone' : client.getLocale(interaction, "commands.info.poll.newPoll"), embeds: [embed], fetchReply: true }).then(async (msg) => {
                if (!(msg instanceof Message)) msg = await interaction.channel!.messages.fetch(msg.id)
                for (let i = 0; i < options.length; i++) {
                    msg.react(alphabet[i]);
                }
            })
        }
    }
} as SlashCommand;