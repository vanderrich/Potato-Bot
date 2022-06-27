import { MessageActionRow, MessageButton, CommandInteraction, MessageComponentInteraction, Message, ContextMenuInteraction, Interaction, ButtonInteraction } from 'discord.js';
import { APIMessage } from "discord-api-types/v9"
import { Client } from './types';

export default async (source: CommandInteraction | ButtonInteraction | ContextMenuInteraction, pages: any[], client: Client, options: any) => {

    const buttons = [
        new MessageButton()
            .setCustomId('first')
            .setLabel('<<')
            .setStyle('PRIMARY')
            .setDisabled(true),
        new MessageButton()
            .setCustomId('previous')
            .setLabel('<')
            .setStyle('PRIMARY')
            .setDisabled(true),
        new MessageButton()
            .setCustomId('next')
            .setLabel('>')
            .setStyle('PRIMARY'),
        new MessageButton()
            .setCustomId('last')
            .setLabel('>>')
            .setStyle('PRIMARY')
    ];
    const row = new MessageActionRow().addComponents(buttons);

    let currentPage = 0;
    let content = {
        embeds: [pages[currentPage].setFooter({ text: client.getLocale(source, "utils.page", currentPage + 1, pages.length) })],
        components: [row],
        fetchReply: true
    }

    const message = source instanceof ButtonInteraction ? await source.update(content) : options.hasSentReply ? await source.editReply(content) : await source.reply(content);
    var pagedMessageTemp = source instanceof CommandInteraction && !options.fromButton ? await source.fetchReply() : message;
    if (!(pagedMessageTemp instanceof Message) || !pagedMessageTemp) pagedMessageTemp = source instanceof CommandInteraction && !options.fromButton ? await source.channel!.messages.fetch((await source.fetchReply()).id) : await source.channel!.messages.fetch(message!.id);
    const pagedMessage = pagedMessageTemp;
    const filter = (button: any) => button.customId === 'first' || button.customId === 'previous' || button.customId === 'next' || button.customId === 'last';
    const collector = await pagedMessage.createMessageComponentCollector({ filter, time: options.timeout });

    collector.on("collect", async (button: ButtonInteraction) => {
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
            embeds: [pages[currentPage].setFooter({ text: client.getLocale(source, "utils.page", currentPage + 1, pages.length) })],
            components: [row]
        });
        collector.resetTimer();
        await button.deferUpdate();
    });

    collector.on("end", (_, reason: string) => {
        if (reason !== "messageDelete" && pagedMessage.editable) {
            row.setComponents(buttons[0].setDisabled(true), buttons[1].setDisabled(true), buttons[2].setDisabled(true), buttons[3].setDisabled(true));
            pagedMessage.edit({
                embeds: [pages[currentPage].setFooter({ text: client.getLocale(source, "utils.page", currentPage + 1, pages.length) })],
                components: [row]
            }).catch((error: any) => { });
        }
    });
    return pagedMessage;
};