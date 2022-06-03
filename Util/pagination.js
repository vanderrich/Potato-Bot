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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = (source, pages, options) => __awaiter(void 0, void 0, void 0, function* () {
    const buttons = [
        new discord_js_1.MessageButton()
            .setCustomId('first')
            .setLabel('<<')
            .setStyle('PRIMARY')
            .setDisabled(true),
        new discord_js_1.MessageButton()
            .setCustomId('previous')
            .setLabel('<')
            .setStyle('PRIMARY')
            .setDisabled(true),
        new discord_js_1.MessageButton()
            .setCustomId('next')
            .setLabel('>')
            .setStyle('PRIMARY'),
        new discord_js_1.MessageButton()
            .setCustomId('last')
            .setLabel('>>')
            .setStyle('PRIMARY')
    ];
    const row = new discord_js_1.MessageActionRow().addComponents(buttons);
    let currentPage = 0;
    let content = {
        embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage + 1}/${pages.length}` })],
        components: [row],
        fetchReply: true
    };
    const message = source instanceof discord_js_1.ButtonInteraction ? yield source.update(content) : options.hasSentReply ? yield source.editReply(content) : yield source.reply(content);
    const pagedMessage = source instanceof discord_js_1.CommandInteraction && !options.fromButton ? yield source.fetchReply() : message;
    if (!(pagedMessage instanceof discord_js_1.Message))
        return console.log("how did this happen");
    const filter = (button) => button.customId === 'first' || button.customId === 'previous' || button.customId === 'next' || button.customId === 'last';
    const collector = yield pagedMessage.createMessageComponentCollector({ filter, time: options.timeout });
    collector.on("collect", (button) => __awaiter(void 0, void 0, void 0, function* () {
        switch (button.customId) {
            case 'first':
                currentPage = 0;
                break;
            case 'previous':
                currentPage = currentPage > 0 ? --currentPage : pages.length - 1;
                break;
            case 'next':
                currentPage = currentPage + 1 < pages.length ? ++currentPage : 0;
                break;
            case 'last':
                currentPage = pages.length - 1;
                break;
        }
        switch (currentPage) {
            case 0:
                row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                break;
            case pages.length - 1:
                row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
                break;
            default:
                row.setComponents(buttons[0].setDisabled(false), buttons[1].setDisabled(false), buttons[2].setDisabled(false), buttons[3].setDisabled(false));
                break;
        }
        pagedMessage.edit({
            embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage + 1}/${pages.length}` })],
            components: [row]
        });
        collector.resetTimer();
        yield button.deferUpdate();
    }));
    collector.on("end", (_, reason) => {
        if (reason !== "messageDelete" && pagedMessage.editable) {
            row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
            pagedMessage.edit({
                embeds: [pages[currentPage].setFooter({ text: `Page ${currentPage + 1}/${pages.length}` })],
                components: [row]
            }).catch((error) => { });
        }
    });
    return pagedMessage;
});
