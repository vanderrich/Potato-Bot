"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const discord_js_1 = require("discord.js");
const ms_1 = __importDefault(require("ms"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("poll")
        .setDescription("Make the bot send a poll")
        .addStringOption(option => option
        .setName("title")
        .setDescription("The title of the poll")
        .setRequired(true))
        .addStringOption(option => option
        .setName("duration")
        .setDescription("The duration the poll will last")
        .setRequired(true))
        .addBooleanOption(option => option
        .setName("ping")
        .setDescription("Should i ping everyone"))
        .addStringOption(option => option
        .setName("description")
        .setDescription("The description of the poll"))
        .addStringOption(option => option.setName("option1").setDescription("The first option of the poll"))
        .addStringOption(option => option.setName("option2").setDescription("The second option of the poll"))
        .addStringOption(option => option.setName("option3").setDescription("The third option of the poll"))
        .addStringOption(option => option.setName("option4").setDescription("The fourth option of the poll"))
        .addStringOption(option => option.setName("option5").setDescription("The fifth option of the poll"))
        .addStringOption(option => option.setName("option6").setDescription("The sixth option of the poll"))
        .addStringOption(option => option.setName("option7").setDescription("The seventh option of the poll"))
        .addStringOption(option => option.setName("option8").setDescription("The eighth option of the poll")),
    category: "Fun",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            var title = interaction.options.getString("title");
            var description = interaction.options.getString("description");
            var options = [];
            var time = new Date(Date.now() + (0, ms_1.default)(interaction.options.getString("duration")));
            var ping = interaction.options.getBoolean("ping") || false;
            if (!time)
                return interaction.reply("Invalid duration!");
            for (var i = 1; i <= 25; i++) {
                if (interaction.options.getString("option" + i) != null) {
                    options.push(interaction.options.getString("option" + i));
                }
            }
            if (options.length < 1) {
                const embed = new discord_js_1.MessageEmbed()
                    .setTitle('📊 ' + title)
                    .setColor('RANDOM')
                    .setDescription(`This poll will end ${discord_js_1.Formatters.time(time, 'R')}`)
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                if (description != null)
                    embed.setDescription(description);
                interaction.reply({ content: ping ? '@everyone' : 'New poll', embeds: [embed], fetchReply: true }).then(msg => {
                    if (msg instanceof discord_js_1.Message) {
                        msg.react('👍');
                        msg.react('👎');
                    }
                });
            }
            else {
                const embed = new discord_js_1.MessageEmbed();
                const alphabet = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱',
                    '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
                const arr = [];
                let count = 0;
                options.forEach(option => {
                    arr.push(alphabet[count] + ' ' + option);
                    count++;
                });
                embed
                    .setTitle('📊 ' + title)
                    .setColor('RANDOM')
                    .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                if (description != null)
                    embed.setDescription(description + '\n\n' + arr.join('\n\n') + `\n\nThis poll will end ${discord_js_1.Formatters.time(time, 'R')}`);
                else
                    embed.setDescription(arr.join('\n\n')) + `\n\nThis poll will end ${discord_js_1.Formatters.time(time, 'R')}`;
                interaction.reply({ content: ping ? '@everyone' : 'New poll', embeds: [embed], fetchReply: true }).then(msg => {
                    if (msg instanceof discord_js_1.Message) {
                        for (let i = 0; i < options.length; i++) {
                            msg.react(alphabet[i]);
                        }
                    }
                });
            }
        });
    }
};
