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
    execute(interaction: CommandInteraction, client: any, footers: Array<string>) {
        let language = interaction.options.getString("language");
        if (!language) return interaction.reply(client.getLocale(client.languages.get(interaction.user.id), "commands.info.language.noLanguage"));
        client.languages.set(interaction.user.id, language);
        return interaction.reply(client.getLocale(language, "commands.info.language.success", language));
    }
}