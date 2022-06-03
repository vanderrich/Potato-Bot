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
const pagination_js_1 = __importDefault(require("../../Util/pagination.js"));
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("list")
        .setDescription("List of all birthdays."),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const birthdays = yield client.birthdays.find({});
            const embed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setAuthor({ name: `Birthdays for ${interaction.guild ? interaction.guild.name : "all servers"}` })
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                .setTimestamp();
            if (birthdays.length == 0) {
                embed.setDescription("No birthdays set!");
                return interaction.reply({ embeds: [embed] });
            }
            else {
                const pages = [];
                let page = 1, emptypage = false;
                do {
                    const pageStart = 10 * (page - 1);
                    const pageEnd = pageStart + 10;
                    birthdays.filter((bday) => client.guilds.cache.get(bday.guildId).members.cache.get(bday.userId));
                    const items = birthdays.slice(pageStart, pageEnd).map((m, i) => {
                        return `**${i + pageStart + 1}**. ${(0, builders_1.userMention)(m.userId)} - ${(0, builders_1.time)(m.birthday, 'd')}`;
                    });
                    if (items.length) {
                        console.log(items);
                        embed.setDescription(`${items.join('\n')}${birthdays.length > pageEnd ? `\n... ${birthdays.length - pageEnd} more item(s)` : ''}`);
                        if (page % 2 === 0)
                            embed.setColor('RANDOM');
                        else
                            embed.setColor('RANDOM');
                        page++;
                    }
                    else {
                        emptypage = true;
                        if (page === 1) {
                            embed.setDescription("No birthdays set!");
                            embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                            console.log(embed);
                            return interaction.reply({ embeds: [embed] });
                        }
                        if (page === 2) {
                            console.log(embed);
                            return interaction.reply({ embeds: [pages[0]] });
                        }
                    }
                } while (!emptypage);
                (0, pagination_js_1.default)(interaction, pages, { timeout: 40000, fromButton: false });
            }
        });
    }
};
