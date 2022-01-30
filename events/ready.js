const random_status = require('./../config.json')
module.exports = {
  name: 'ready',
  execute(client) {
    console.log('Ready!')
    client.user.setUsername('Potato bot')
    client.user.setActivity(random_status[Math.floor(Math.Random * random_status.length)]);
  }
}