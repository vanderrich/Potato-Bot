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
const v9_1 = require("discord-api-types/v9");
const discord_js_1 = require("discord.js");
const pagination_1 = __importDefault(require("../../Util/pagination"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("inv")
        .setDescription("View your inventory")
        .addUserOption(option => option
        .setName("user")
        .setDescription("The user to view the inventory of.")
        .setRequired(true)),
    contextMenu: new builders_1.ContextMenuCommandBuilder()
        .setName("inv")
        .setType(v9_1.ApplicationCommandType.User),
    category: "Currency",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
            const embed = new discord_js_1.MessageEmbed()
                .setAuthor({ name: `Inventory of ${interaction.user.tag}` })
                .setColor("RANDOM")
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            const invPure = yield client.eco.getUserItems({ user });
            if (!invPure) {
                embed.setDescription(`No items in the inventory.`);
                return interaction.reply({ embeds: [embed] });
            }
            else {
                // const arrayToObject = invPure.reduce((itemsobj, x) => {
                //   itemsobj[x.name] = (itemsobj[x.name] || 0) + 1;
                //   return itemsobj;
                // }, {});
                let inv = invPure.inventory;
                const pages = [];
                let page = 1, emptypage = false;
                do {
                    const pageStart = 10 * (page - 1);
                    const pageEnd = pageStart + 10;
                    const items = inv.slice(pageStart, pageEnd).map((m, i) => {
                        return `** ${i + pageStart + 1}**. ${m.name} - ${m.amount} ${m.amount > 1 ? 'items' : 'item'}`;
                    });
                    if (items.length) {
                        const embed = new discord_js_1.MessageEmbed();
                        embed.setAuthor({ name: `Inventory of ${interaction.user.tag}` });
                        embed.setDescription(`${items.join('\n')}${inv.length > pageEnd
                            ? `\n... ${inv.length - pageEnd} more item(s)`
                            : ''} `);
                        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                        if (page % 2 === 0)
                            embed.setColor('RANDOM');
                        else
                            embed.setColor('RANDOM');
                        pages.push(embed);
                        page++;
                    }
                    else {
                        emptypage = true;
                        if (page === 1) {
                            const embed = new discord_js_1.MessageEmbed()
                                .setAuthor({ name: `Inventory of ${interaction.user.tag}` })
                                .setColor('RANDOM')
                                .setDescription(`No more items in the inventory.`)
                                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
                            return interaction.reply({ embeds: [embed] });
                        }
                        if (page === 2) {
                            return interaction.reply({ embeds: [pages[0]] });
                        }
                    }
                } while (!emptypage);
                (0, pagination_1.default)(interaction, pages, { timeout: 40000, fromButton: false, replyHasSent: false });
            }
        });
    }
};
