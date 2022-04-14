const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mute")
    .setDescription("Mute a user")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to mute.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("The reason for the mute.")
        .setRequired(false)
    ),
  permissions: 'MANAGE_MESSAGES',
  async execute(interaction, client, Discord) {
    //initialize
    var channel = interaction.guild.channels.cache.find(channel => channel.name.includes("mod"));
    var user = interaction.options.getUser("target");
    var reason = interaction.options.getString("reason");

    //conditions
    if (!reason) { reason = "No reason given"; }

    //kick
    var kickEmbed = new Discord.MessageEmbed()
      .setTitle("Kick")
      .addField("Kicked user", `${user}`)
      .addField("Reason", `${reason}`)
      .setFooter({ text: `Kicked by ${interaction.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) })
      .setTimestamp();
    user.kick();
    channel.send({ embeds: [kickEmbed] });
  }
}