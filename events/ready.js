module.exports = {
  name: 'ready',
  execute(client) {
    console.log('Ready!')
    client.user.setUsername('Potato bot')
    client.user.setActivity(`Serving ${client.guilds.cache.size} servers`)
  }
}