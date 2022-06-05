import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Make the bot say something")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The text you want the bot to say")
                .setRequired(true),
        ),
    category: "Fun",
    execute(interaction: CommandInteraction) {
        let text = interaction.options.getString("text");
        if (!text) return interaction.reply("You need to enter a text to say!");
        if (text.length > 2000) return interaction.reply("Your text is too long!");
        if (text.includes("@everyone") || text.includes("@here") && !interaction.memberPermissions?.has('MENTION_EVERYONE')) return interaction.reply("You dont have the permission ping everyone or here!");
        interaction.reply(text);
    }
}