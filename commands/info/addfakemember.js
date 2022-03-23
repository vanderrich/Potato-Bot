module.exports = {
  name: "addfakemember",
  category: "Info",
  execute(message, args, cmd, client) {
    const guild = message.guild
    const member = guild.members.cache.get(message.author.id)
    client.emit('guildMemberAdd', member)
  }
}