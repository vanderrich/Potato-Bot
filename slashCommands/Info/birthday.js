const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("birthday")
        .setDescription("Birthday commands")
        .addSubcommand(subcommand => subcommand
            .setName("set")
            .setDescription("Set your birthday.")
            .addStringOption(option => option
                .setName("birthdate")
                .setDescription("Your birthdate in MM/DD, eg. 01/01")
                .setRequired(true)
            ),
        )
        .addSubcommand(subcommand => subcommand
            .setName("list")
            .setDescription("List all birthdays.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("remove")
            .setDescription("Remove your birthday data.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("next")
            .setDescription("Get the next birthday.")
        )
        .addSubcommand(subcommand => subcommand
            .setName("setup")
            .setDescription("Setup your birthday channel.")
            .addChannelOption(option => option
                .setName("birthdaychannel")
                .setDescription("The channel to send the birthday messages to.")
            )
            .addRoleOption(option => option
                .setName("birthdayrole")
                .setDescription("The role to give to users whose birthday is today.")
            )
            .addStringOption(option => option
                .setName("birthdaymessage")
                .setDescription("The role to give to users whose birthday is today, to ping the user type <@${user.id}>.")
            )
        ),
    category: "Info",
    execute(interaction, client, Discord, footers) {
        require("./" + interaction.options.getSubcommand() + "bday").execute(interaction, client, Discord, footers);
    }
}