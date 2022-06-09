import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("language")
        .setDescription("Change the language of the bot.")
        .addStringOption(option => option
            .setName("language")
            .setDescription("The language to change to.")
            .addChoices(
                { name: "English", value: "en" },
                { name: "Indonesian", value: "id" },
            )
            .setRequired(true)
        ),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        let language = interaction.options.getString("language");
        if (!language) return interaction.reply(client.getLocale(interaction.user.id, "commands.info.language.noLanguage"));
        let languageDoc = await client.languages.findOne({ user: interaction.user.id });
        if (!languageDoc)
            languageDoc = new client.languages({ user: interaction.user.id, language: language });
        else
            languageDoc.language = language;
        await languageDoc.save();
        return interaction.reply(client.getLocale(interaction.user.id, "commands.info.language.success", language));
    }
}