import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed, CommandInteraction, GuildMember } from "discord.js";
import ms from "ms";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a user for a specified amount of time.")
        .addUserOption(option => option
            .setName("member")
            .setRequired(true)
            .setDescription("The user to timeout."))
        .addStringOption(option => option
            .setName("time")
            .setRequired(true)
            .setDescription("The amount of time to timeout the user for."))
        .addStringOption(option => option
            .setName("reason")
            .setRequired(false)
            .setDescription("The reason for the timeout.")),
    permissions: "TIMEOUT_MEMBERS",
    category: "Moderation",
    execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const member = interaction.options.getMember("member");
        const time = Date.now() - ms(interaction.options.getString("time"));
        const reason = interaction.options.getString("reason") || "No reason given.";
        if (!member || !(member instanceof GuildMember)) return interaction.reply("Invalid member!");
        if (!time) return interaction.reply("Invalid time!");
        if (member.id === client.user.id) return interaction.reply("I can't timeout myself!");

        member.timeout(time, reason);
        interaction.reply(`Success`);
    }
}