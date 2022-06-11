import { APIMessage } from "discord-api-types/v9";
import { Message, MessageActionRow, MessageSelectMenu, Modal, ModalSubmitInteraction, SelectMenuInteraction, TextInputComponent } from "discord.js";
import config from "../../config.json";
type KeyofBadWordPresets = string & "low" | "medium" | "high" | "highest";
const badWordPresets = config.settings.badWordPresets;

module.exports = {
    name: "settings",
    async execute(interaction: SelectMenuInteraction, client: any) {
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guildId });
        const locale = client.getLocale(interaction.user.id, "commands.moderation.settings");
        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("settings")
                    .addOptions([
                        { label: locale.badWords, value: "badWords" },
                        { label: locale.welcome, value: "welcome" },
                        { label: locale.tags, value: "tags" },
                        { label: locale.misc, value: "misc" }
                    ])
            )

        const selected = interaction.values[0];
        switch (selected) {
            case "badWords":
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
                    msg.createMessageComponentCollector({ time: 30000, componentType: "SELECT_MENU" }).on("collect", async (collected: SelectMenuInteraction) => {
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
                                            .setValue(guildSettings.badWords.join(", "))
                                    )
                                )
                            await collected.showModal(modal);
                            collected.awaitModalSubmit({ time: 30000, filter: (modalInteraction: ModalSubmitInteraction) => modalInteraction.user.id === interaction.user.id && modalInteraction.customId === modal.customId }).then(async (modal: ModalSubmitInteraction) => {
                                const badWords = modal.fields.getTextInputValue("badWord").split(",").map((word: string) => word.trim());
                                await client.guildSettings.updateOne({ guildId: interaction.guild!.id }, { $set: { badWords } });
                                modal.reply(locale.updated);
                            });
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
                });
                break;
            case "tags":
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
                    const suggestionChannelObject = interaction.guild!.channels.cache.find((channel) => channel.name === suggestionChannel);
                    if (!suggestionChannelObject?.id && suggestionChannel) return interaction.reply(locale.invalidChannel);
                    const ghostPing = ghostPingTextInput in locale.yes;
                    await client.guildSettings.updateOne({ guildId: interaction.guild!.id }, {
                        $set: {
                            suggestionChannel: suggestionChannelObject?.id || undefined,
                            ghostPing: ghostPingTextInput ? ghostPing : undefined
                        }
                    });
                });
                break;
        }
    }
}