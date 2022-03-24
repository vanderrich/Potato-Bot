module.exports = {
  name: 'mute',
  description: 'mute someone',
  permissions: 'MANAGE_MESSAGES',
  guildOnly: true,
  category: "Moderation",
  async execute(message, args, cmd, client, Discord) {
    //initialize
    var channel = message.guild.channels.cache.find(channel => channel.name.includes("mod"));
    var user = message.mentions.members.first();
    var reason = args[args.length - 1];

    //conditions
    if (!user) return message.channel.send("You have to mention a valid member");
    if (!channel) {
      message.channel.send("There's no channel with the name `moderators`");
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
    var kickEmbed = new Discord.MessageEmbed()
      .setTitle("Kick")
      .addField("Kicked user", `${user}`)
      .addField("Reason", `${reason}`)
      .setFooter({ text: `Kicked by ${message.author.tag}` })
      .setTimestamp();
    user.kick();
    channel.send({ embeds: [kickEmbed] });
  }
}