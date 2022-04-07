const { admins } = require("../../config.json")
const Service = require('node-windows').Service;
module.exports = {
    name: 'uninstallservice',
    category: "BotAdminOnly",
    execute(message, args, cmd, client) {
        if (!admins.includes(message.author.id)) return;
        message.channel.send('uninstalling the service...')
        client.svc.uninstall();
        message.channel.send('service uninstalled')
    }
}