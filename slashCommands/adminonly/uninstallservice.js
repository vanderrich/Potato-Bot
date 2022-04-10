const { admins } = require("../../config.json")
const Service = require('node-windows').Service;
module.exports = {
    name: 'uninstallservice',
    category: "Bot Admin Only",
    permissions: "BotAdmin",
    execute(interaction, args, cmd, client) {
        if (!admins.includes(interaction.user.id)) return;
        interaction.reply('uninstalling the service...')
        client.svc.uninstall();
        interaction.channel.send('service uninstalled')
    }
}