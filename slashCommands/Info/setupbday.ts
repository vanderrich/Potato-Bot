import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildChannel } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("setup")
        .setDescription("Setup your birthday channel.")
        .addChannelOption(option => option
            .setName("birthdaychannel")
            .setDescription("The channel to send the birthday messages to.")
        )
        .addRoleOption(option => option
            .setName("birthdayrole")
            .setDescription("The role to give to users whose birthday is today, to ping the user type <@${user.id}>.")
        )
        .addStringOption(option => option
            .setName("birthdaymessage")
            .setDescription("The message to send to users whose birthday is today.")
    ) as SlashCommandSubcommandBuilder,
    category: "Info",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        if (!interaction.guild) return interaction.editReply("This command can only be used in a guild!");

        const birthdayRole = interaction.options.getRole("birthdayrole");
        const birthdayChannel = interaction.options.getChannel("birthdaychannel");
        const birthdayMessage = interaction.options.getString("birthdaymessage");

        if (birthdayChannel instanceof GuildChannel && birthdayChannel)
            if (!birthdayChannel.isText() && birthdayChannel != null) return interaction.reply("That channel is not a text channel!");

        const birthdayConfig = await client.birthdayConfigs.findOne({ guildId: interaction.guild.id });

        if (birthdayConfig) {
            client.birthdayConfigs.updateOne({ guildId: interaction.guild.id }, { $set: { birthdayChannel: birthdayChannel, birthdayRole: birthdayRole, birthdayMessage: birthdayMessage } });
        } else {
            new client.birthdayConfigs(
                {
                    guildId: interaction.guild.id,
                    channelId: birthdayChannel?.id,
                    roleId: birthdayRole?.id,
                    message: birthdayMessage
                }
            ).save();
        }

        interaction.reply("Your birthday data has been set!");
        console.log(`[INFO] ${interaction.user.tag} set their birthday data`);
    }
}