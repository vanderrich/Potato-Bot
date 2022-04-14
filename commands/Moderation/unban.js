module.exports = {
  name: 'unban',
  description: "This command unbans a member!",
  permissions: "BAN_MEMBERS",
  category: "Moderation",
  async execute(message, args, cmd, client, Discord) {
    //initialize
    var channel = message.guild.channels.cache.find(channel => channel.name.includes("mod"));
    var user = args.join(' ');

    //conditions
    if (!user) return message.reply("You have to mention a valid member");
    if (!channel) {
      message.reply("There's no channel that includes `mod` in their name, creating the channel");
      //create channel
      channel = await message.guild.channels.create("modlogs", {
        type: "text",
        permissionOverwrites: [
          {
            id: message.guild.id,
            deny: ["VIEW_CHANNEL"],
          },
          {
            id: message.guild.roles.cache.find(
              (role) => role.name.toLowerCase().includes("mod")
            ),
            allow: ["VIEW_CHANNEL"],
          },
        ],
      });
    }
    if (reason == user || !reason) { reason = "No reason given"; }

    //kick
    var banEmbed = new Discord.MessageEmbed()
      .setTitle("Unban")
      .addField("Unbanned user", `<@${user}>`)
      .setThumbnail(user.avatarURL())
      .setFooter({ text: `Unbanned by ${message.author.tag}`, iconURL: message.author.avatarURL({ dynamic: true }) })
      .setTimestamp();
    guild.members.unban(user);
    channel.send({ embeds: [banEmbed] });
  }
}