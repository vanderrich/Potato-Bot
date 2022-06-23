//this is now useless
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("welcome")
        .setDescription("Welcome stuff")
        .addStringOption(option => option
            .setName("message")
            .setDescription("The welcome message.")
            .setRequired(false)
        )
        .addRoleOption(option => option
            .setName("role")
            .setDescription("The role to give to the user.")
            .setRequired(false)
        )
        .addChannelOption(option => option
            .setName("channel")
            .setDescription("The channel to send the welcome message.")
            .setRequired(false)
        ),
    category: "Moderation",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const message = interaction.options.getString("message");
        const role = interaction.options.getRole("role");
        const channel = interaction.options.getChannel("channel");
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild.id });

        if (!guildSettings) {
            const guildSettings = new client.guildSettings({
                guildId: interaction.guild.id,
                welcomeMessage: message,
                welcomeRole: role?.id,
                welcomeChannel: channel?.id
            });
            guildSettings.save();
        } else {
            guildSettings.welcomeMessage = message;
            guildSettings.welcomeRole = role?.id;
            guildSettings.welcomeChannel = channel?.id;
            guildSettings.save();
        }
        interaction.reply("Updated settings.");
    }
}