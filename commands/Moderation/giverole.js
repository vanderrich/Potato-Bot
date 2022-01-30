module.exports = {
  name: 'giverole',
  description: 'give someone a role',
  permission: 'MANAGE_MEMBERS',
  guildOnly: true,
  execute(message, args){
    //variables
    const targetuser = message.mentions.users.first()
    args.shift()
    const rolename = args.join(' ')
    const { guild } = message
    const role = guild.roles.cache.find((role) => {
      return role.name === rolename
    })

    //conditions
    if(!targetuser){
      message.reply('Please specify someone to give the role to')
      return
    }
    if (!role){
      message.reply(`There is no role named "${rolename}"`)
    }

    //role
    const member = guild.members.cache.get(targetuser.id)
    member.roles.add(role)
    message.reply(`That user now has the ${rolename} role!`)
  }
}