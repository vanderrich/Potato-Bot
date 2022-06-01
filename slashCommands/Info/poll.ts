import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, Message, MessageEmbed, Formatters } from "discord.js";
import ms from "ms";

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
        .addStringOption(option => option.setName("option8").setDescription("The eighth option of the poll")),
    category: "Fun",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        var title = interaction.options.getString("title");
        var description = interaction.options.getString("description");
        var options = [];
        var time = new Date(Date.now() + ms(interaction.options.getString("duration")));
        var ping = interaction.options.getBoolean("ping") || false;
        if (!time) return interaction.reply("Invalid duration!");
        for (var i = 1; i <= 25; i++) {
            if (interaction.options.getString("option" + i) != null) {
                options.push(interaction.options.getString("option" + i));
            }
        }

        if (options.length < 1) {
            const embed = new MessageEmbed()
                .setTitle('📊 ' + title)
                .setColor('RANDOM')
                .setDescription(`This poll will end ${Formatters.time(time, 'R')}`)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            if (description != null) embed.setDescription(description)

            interaction.reply({ content: ping ? '@everyone' : 'New poll', embeds: [embed], fetchReply: true }).then(msg => {
                if (msg instanceof Message) {
                    msg.react('👍');
                    msg.react('👎');
                }
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
            if (description != null) embed.setDescription(description + '\n\n' + arr.join('\n\n') + `\n\nThis poll will end ${Formatters.time(time, 'R')}`);
            else embed.setDescription(arr.join('\n\n')) + `\n\nThis poll will end ${Formatters.time(time, 'R')}`;

            interaction.reply({ content: ping ? '@everyone' : 'New poll', embeds: [embed], fetchReply: true }).then(msg => {
                if (msg instanceof Message) {
                    for (let i = 0; i < options.length; i++) {
                        msg.react(alphabet[i]);
                    }
                }
            })
        }
    }
}