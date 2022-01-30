module.exports = {
  name: "addfakemember",
  execute(message, args, cmd, client){
    const guild = client.guilds.cache.get("893532780946919536")
    const member = guild.members.cache.get(message.author.id)
    client.emit('guildMemberAdd', member)
  }
}