const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user")
    .addStringOption(option =>
      option
        .setName("target")
        .setDescription("The userID to unban.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("The reason for the unban.")
        .setRequired(false)
    ),
  permissions: 'BAN_MEMBERS',
  async execute(interaction, client, Discord) {
    //initialize
    var channel = interaction.guild.channels.cache.find(channel => channel.name.includes("mod"));
    var user = interaction.options.getString("target");
    var reason = interaction.options.getString("reason");

    //conditions
    if (!reason) { reason = "No reason given"; }

    //kick
    var banEmbed = new Discord.MessageEmbed()
      .setTitle("Unban")
      .addField("Unbanned user", `<@${user}>`)
      .setFooter({ text: `Unbanned by ${interaction.author.tag}` })
      .setTimestamp();
    guild.members.unban(user);
    channel.send({ embeds: [banEmbed] });
  }
}