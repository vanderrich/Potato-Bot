module.exports = {
  name: 'removerole',
  description: 'remove someone\'s role',
  category: "Moderation",
  async execute(message, args) {
    const targetuser = message.mentions.users.first()
    args.shift()  
    const rolename = args.join(' ')
    const { guild } = message
    const role = guild.roles.cache.find((role) => {
      return role.name === rolename
    })

    //conditions
    if(!targetuser){
      message.reply('Please specify someone to remove the role to')
      return
    }
    if (!role){
      message.reply(`there is no role named "${rolename}"`)
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

    //remove role
    const roleEmbed = new Discord.MessageEmbed()
      .setTitle('Remove Role')
      .addField('Role', `${role}`)
    const member = guild.members.cache.get(targetuser.id)
    member.roles.remove(role.id)
    channel.send({ embeds: [roleEmbed] })
  }
}