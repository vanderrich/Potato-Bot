import { SlashCommandBuilder } from "@discordjs/builders"
import Discord from "discord.js"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addfakemember")
        .setDescription("Adds a fake member to the server"),
    permissions: 'BotAdmin',
    category: "Bot Admin Only",
    execute: (interaction: Discord.CommandInteraction, client: Discord.Client) => {
        if (!interaction.member) return interaction.reply("You must be in a guild to use this command.")
        if (!interaction.inCachedGuild()) return interaction.reply("You must be in a cached guild to use this command.")
        client.emit("guildMemberAdd", interaction.member);
        interaction.reply("Added fake member");
    }
}