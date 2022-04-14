const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the ban.")
                .setRequired(false)

        ),
    permissions: 'BAN_MEMBERS',
    async execute(interaction, client, Discord) {
        //initialize
        var channel = interaction.guild.channels.cache.find(channel => channel.name.includes("mod"));
        var user = interaction.options.getUser("target");
        var reason = interaction.options.getString("reason");

        //conditions
        if (!reason) { reason = "No reason given"; }

        //kick
        var banEmbed = new Discord.MessageEmbed()
            .setTitle("Ban")
            .addField("Banned user", `${user}`)
            .addField("Reason", `${reason}`)
            .setFooter({ text: `Banned by ${interaction.author.tag}`, iconURL: interaction.author.avatarURL({ dynamic: true }) })
            .setTimestamp();
        user.ban();
        channel.send({ embeds: [banEmbed] });
    }
}