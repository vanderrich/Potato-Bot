import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setNameLocalization("zh-CN", "语言")
        .setDescriptionLocalization("zh-CN", "改变机器人的语言。")
        .setDescription("Change the language of the bot.")
        .addStringOption(option => option
            .setName("language")
            .setDescription("The language to change to.")
            .addChoices(
                { name: "English", value: "en" },
                { name: "Indonesian", value: "id" },
            )
            .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction: CommandInteraction, client: Client) {
        await interaction.deferReply();
        let language = interaction.options.getString("language");
        if (!language) return interaction.editReply(client.getLocale(interaction, "commands.info.language.noLanguage"));
        let languageDoc = await client.languages.findOne({ user: interaction.user.id });
        if (!languageDoc)
            languageDoc = new client.languages({ user: interaction.user.id, language: language });
        else
            languageDoc.language = language;
        await languageDoc.save();
        client.updateCache();
        return interaction.editReply(client.getLocale(interaction, "commands.info.language.success", language));
    }
} as SlashCommand;