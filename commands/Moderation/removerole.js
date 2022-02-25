module.exports = {
  name: 'removerole',
  description: 'remove someone\'s role',
  category: "Moderation",
  execute(message, args) {
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
    const member = guild.members.cache.get(targetuser.id)

    //remove role
    if (member.roles.cache.get(role.id)){
      member.roles.remove(role)
      message.reply(`that user no longer has the ${rolename} role!`)
    }else {
      message.reply(`that user doesn't have the role named ${rolename}`)
    }
  }
}