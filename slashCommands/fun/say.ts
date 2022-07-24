import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Make the bot say something")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The text you want the bot to say")
                .setRequired(true),
    ) as SlashCommandBuilder,
    category: "Fun",
    async execute(interaction: CommandInteraction, client: Client) {
        let text = interaction.options.getString("text");
        if (!text) return interaction.reply(client.getLocale(interaction, "commands.fun.say.noText"));
        if (text.length > 2000) return interaction.reply(client.getLocale(interaction, "commands.fun.say.textTooLong"));
        if (text.includes("@everyone") || text.includes("@here") && !interaction.memberPermissions?.has('MENTION_EVERYONE')) return interaction.reply(client.getLocale(interaction, "commands.fun.say.noPerms"));
        interaction.reply(text);
    }
} as SlashCommand;