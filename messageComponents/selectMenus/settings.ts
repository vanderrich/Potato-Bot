import { APIMessage } from "discord-api-types/v9";
import { Message, MessageActionRow, MessageSelectMenu, Modal, ModalSubmitInteraction, SelectMenuInteraction, TextInputComponent, TextBasedChannel } from "discord.js";
import config from "../../config.json";
import { Client, GuildSettings } from "../../Util/types";
type KeyofBadWordPresets = string & "low" | "medium" | "high" | "highest";
const badWordPresets = config.settings.badWordPresets;

module.exports = {
    name: "settings",
    async execute(interaction: SelectMenuInteraction, client: Client) {
        if (interaction.replied) return;
        const guildSettings: GuildSettings | null = await client.guildSettings.findOne({ guildId: interaction.guildId });
        const locale = client.getLocale(interaction, "commands.moderation.settings");
        const selected = interaction.values[0];
        switch (selected) {
            case "badWords":
                const actionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("settings")
                            .addOptions([
                                { label: locale.badWords, value: "badWords", default: true },
                                { label: locale.welcome, value: "welcome" },
                                { label: locale.tags, value: "tags" },
                                { label: locale.misc, value: "misc" }
                            ])
                    )
                const badWordPresetActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("badWordPreset")
                            .addOptions([
                                { label: locale.badWordPresetNames.low, value: "low" },
                                { label: locale.badWordPresetNames.medium, value: "medium" },
                                { label: locale.badWordPresetNames.high, value: "high" },
                                { label: locale.badWordPresetNames.highest, value: "highest" },
                                { label: locale.badWordPresetNames.custom, value: "custom" }
                            ])
                    )
                interaction.update({ components: [actionRow, badWordPresetActionRow], fetchReply: true }).then(async (msg: Message | APIMessage) => {
                    if (!(msg instanceof Message)) return;
                    msg.createMessageComponentCollector({ time: 600000, componentType: "SELECT_MENU" }).on("collect", async (collected: SelectMenuInteraction) => {
                        const selected = collected.values[0];
                        if (selected === "custom") {
                            const modal = new Modal()
                                .setTitle(locale.customBadWords)
                                .setCustomId("customBadWords")
                                .addComponents(new MessageActionRow<TextInputComponent>()
                                    .addComponents(
                                        new TextInputComponent()
                                            .setCustomId("badWord")
                                            .setLabel("Bad Words")
                                            .setPlaceholder(locale.customBadWordTextInputPlaceHolder)
                                            .setValue(guildSettings!.badWords.join(","))
                                    )
                                )
                            await collected.showModal(modal);
                            collected.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === modal.customId }).then(async (modal: ModalSubmitInteraction) => {
                                const badWords = modal.fields.getTextInputValue("badWord").split(",").map((word: string) => word.trim());
                                await client.guildSettings.updateOne({ guildId: interaction.guild!.id }, { $set: { badWords } });
                                modal.reply(locale.updated);
                            }).catch(() => { });
                        } else {
                            const badWords = badWordPresets[selected as KeyofBadWordPresets];
                            await client.guildSettings.updateOne({ guildId: interaction.guild!.id }, { $set: { badWords } });
                            collected.reply(locale.updated);
                        }
                    });
                });
                break;
            case "welcome":
                const welcomeModal = new Modal()
                    .setTitle(locale.welcome)
                    .setCustomId("welcome")
                    .addComponents(new MessageActionRow<TextInputComponent>()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId("welcomeMessage")
                                .setLabel(locale.welcomeMessage)
                                .setPlaceholder(locale.welcomeMessageTextInputPlaceHolder)
                                .setStyle("SHORT")
                        ),
                        new MessageActionRow<TextInputComponent>()
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId("welcomeChannel")
                                    .setLabel(locale.welcomeChannel)
                                    .setPlaceholder(locale.welcomeChannelTextInputPlaceHolder)
                                    .setStyle("SHORT")
                            ),
                        new MessageActionRow<TextInputComponent>()
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId("welcomeRole")
                                    .setLabel(locale.welcomeRole)
                                    .setPlaceholder(locale.welcomeRoleTextInputPlaceHolder)
                                    .setStyle("SHORT")
                            )
                    )
                await interaction.showModal(welcomeModal);
                interaction.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === welcomeModal.customId }).then(async (modal: ModalSubmitInteraction) => {
                    const welcomeMessage = modal.fields.getTextInputValue("welcomeMessage");
                    const welcomeChannel = modal.fields.getTextInputValue("welcomeChannel");
                    const welcomeRole = modal.fields.getTextInputValue("welcomeRole");
                    const welcomeChannelObject = interaction.guild!.channels.cache.find((channel) => channel.name === welcomeChannel);
                    const welcomeRoleObject = interaction.guild!.roles.cache.get(welcomeRole);
                    if (!welcomeChannelObject && welcomeChannel) return interaction.reply(locale.invalidChannel);
                    if (!welcomeRoleObject && welcomeRole) return interaction.reply(locale.invalidRole);

                    await client.guildSettings.updateOne({ guildId: interaction.guild!.id }, {
                        $set: {
                            welcomeMessage: welcomeMessage || undefined,
                            welcomeChannel: welcomeChannelObject?.id || undefined,
                            welcomeRole: welcomeRole || undefined
                        }
                    });
                    modal.reply(locale.updated);
                }).catch(() => { });
                break;
            case "tags":
                const tagActionRow = new MessageActionRow()
                    .addComponents(
                        new MessageSelectMenu()
                            .setCustomId("tagaction")
                            .addOptions([
                                { label: locale.addTag, value: "add" },
                                { label: locale.removeTag, value: "remove" }
                            ])
                )
                interaction.update({ components: [tagActionRow], fetchReply: true }).then(async (msg: Message | APIMessage) => {
                    if (!(msg instanceof Message)) return;
                    const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild!.id })!;
                    if (!guildSettings) return
                    msg.createMessageComponentCollector({ time: 600000, componentType: "SELECT_MENU" }).on("collect", async (collected: SelectMenuInteraction) => {
                        const selected = collected.values[0];
                        if (selected === "add") {
                            const modal = new Modal()
                                .setTitle(locale.addTag)
                                .setCustomId("addTag")
                                .addComponents(new MessageActionRow<TextInputComponent>()
                                    .addComponents(
                                        new TextInputComponent()
                                            .setCustomId("tag")
                                            .setLabel(locale.tag)
                                            .setPlaceholder(locale.tagTextInputPlaceHolder)
                                            .setStyle("SHORT")
                                            .setRequired(true),
                                        new TextInputComponent()
                                            .setCustomId("customid")
                                            .setLabel(locale.customid)
                                            .setPlaceholder(locale.customIdInputPlaceHolder)
                                            .setStyle("SHORT")
                                            .setRequired(true),
                                        new TextInputComponent()
                                            .setCustomId("value")
                                            .setLabel(locale.value)
                                            .setPlaceholder(locale.valueInputPlaceHolder)
                                            .setStyle("PARAGRAPH")
                                            .setRequired(true)
                                    )
                                )
                            await collected.showModal(modal);
                            collected.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === modal.customId }).then(async (modal: ModalSubmitInteraction) => {
                                const tag = modal.fields.getTextInputValue("tag");
                                const customid = modal.fields.getTextInputValue("customid")?.toLowerCase().replace(/ /g, "");
                                const value = modal.fields.getTextInputValue("value")
                                if (!guildSettings.tags) guildSettings.tags = [];
                                if (!guildSettings.tagDescriptions) guildSettings.tagDescriptions = {};
                                guildSettings.tags.push({ name: tag, value: customid });
                                guildSettings.tagDescriptions = { [customid]: value! };
                                guildSettings.save();
                                modal.reply(locale.updated);
                            }).catch(() => { });
                        } else if (selected === "remove") {
                            const modal = new Modal()
                                .setTitle(locale.removeTag)
                                .setCustomId("removeTag")
                                .addComponents(new MessageActionRow<TextInputComponent>()
                                    .addComponents(
                                        new TextInputComponent()
                                            .setCustomId("tag")
                                            .setLabel(locale.tag)
                                            .setPlaceholder(locale.tagTextInputPlaceHolder)
                                            .setStyle("SHORT")
                                            .setRequired(true),
                                        new TextInputComponent()
                                            .setCustomId("customid")
                                            .setLabel(locale.customid)
                                            .setPlaceholder(locale.customIdTextInputPlaceHolder)
                                            .setStyle("SHORT")
                                            .setRequired(true)
                                    )
                                )
                            await collected.showModal(modal);
                            collected.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === modal.customId }).then(async (modal: ModalSubmitInteraction) => {
                                const customid = modal.fields.getTextInputValue("customid");
                                const tag = modal.fields.getTextInputValue("tag");
                                guildSettings.tags = guildSettings.tags.filter((t: any) => t.name !== tag && t.value !== customid);
                                delete guildSettings.tagDescriptions[customid];
                                modal.reply(locale.updated);
                            }).catch(() => { });
                        }
                    });
                });
                break;
            case "misc":
                const miscModal = new Modal()
                    .setTitle(locale.miscSettings)
                    .setCustomId("misc")
                    .addComponents(new MessageActionRow<TextInputComponent>()
                        .addComponents(
                            new TextInputComponent()
                                .setCustomId("suggestionChannel")
                                .setLabel(locale.suggestionChannel)
                                .setPlaceholder(locale.suggestionChannelTextInputPlaceHolder)
                                .setStyle("SHORT")
                        ),
                        new MessageActionRow<TextInputComponent>()
                            .addComponents(
                                new TextInputComponent()
                                    .setCustomId("ghostPing")
                                    .setLabel(locale.ghostPing)
                                    .setPlaceholder(locale.ghostPingTextInputPlaceHolder)
                                    .setStyle("SHORT")
                            )
                    )
                await interaction.showModal(miscModal);
                interaction.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === miscModal.customId }).then(async (modal: ModalSubmitInteraction) => {
                    const suggestionChannel = modal.fields.getTextInputValue("suggestionChannel");
                    const ghostPingTextInput = modal.fields.getTextInputValue("ghostPing");
                    const suggestionChannelObject: TextBasedChannel | undefined = modal.guild!.channels.cache.find((channel) => channel.name === suggestionChannel && channel.isText()) as TextBasedChannel;
                    if (!suggestionChannelObject?.id && suggestionChannel) return modal.reply(locale.invalidChannel);
                    const ghostPing = ghostPingTextInput in locale.yes;
                    await client.guildSettings.updateOne({ guildId: modal.guild!.id }, {
                        $set: {
                            suggestionChannel: suggestionChannelObject?.id || undefined,
                            ghostPing: ghostPingTextInput ? ghostPing : undefined
                        }
                    });
                    return modal.reply(locale.updated)
                }).catch(() => { });
                break;
        }
    }
}