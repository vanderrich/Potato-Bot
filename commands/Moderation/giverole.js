module.exports = {
  name: 'giverole',
  description: 'give someone a role',
  permission: 'MANAGE_MEMBERS',
  guildOnly: true,
  category: "Moderation", 
  async execute(message, args, cmd, client, Discord) {
    //variables
    const targetuser = message.mentions.users.first()
    args.shift()
    const rolename = args.join(' ')
    const { guild } = message
    const role = message.mentions.users.first() || guild.roles.cache.find((role) => {
      return role.name === rolename
    })
    var channel = message.guild.channels.cache.find(channel => channel.name.includes("mod"));

    //conditions
    if(!targetuser){
      message.reply('Please specify someone to give the role to')
      return
    }
    if (!role){
      message.reply(`There is no role named "${rolename}"`)
    }
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


    //role
    const roleEmbed = new Discord.MessageEmbed()
      .setTitle('Give Role')
      .addField('Role', `${role}`)
    const member = guild.members.cache.get(targetuser.id)
    member.roles.add(role.id)
    channel.send({ embeds: [roleEmbed] })
  }
}