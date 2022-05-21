const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("setupbday")
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
        ),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, Discord, footers) {
        const user = interaction.user;
        const guild = interaction.guild;

        const birthdayRole = interaction.options.getRole("birthdayrole");
        const birthdayChannel = interaction.options.getChannel("birthdaychannel");
        const birthdayMessage = interaction.options.getString("birthdaymessage");

        if (!birthdayChannel?.isText() && birthdayChannel != null) return inteaction.reply("That channel is not a text channel!");

        const birthdayConfig = await client.birthdayConfigs.findOne({ guildId: guild.id });

        if (birthdayConfig) {
            client.birthdayConfigs.updateOne({ guildId: guild.id }, { $set: { birthdayChannel: birthdayChannel, birthdayRole: birthdayRole, birthdayMessage: birthdayMessage } });
        } else {
            new client.birthdayConfigs(
                {
                    guildId: guild.id,
                    channelId: birthdayChannel.id,
                    roleId: birthdayRole.id,
                    message: birthdayMessage
                }
            ).save();
        }

        interaction.reply("Your birthday data has been set!");
        console.log(`[INFO] ${user.tag} set their birthday data`);
    }
}