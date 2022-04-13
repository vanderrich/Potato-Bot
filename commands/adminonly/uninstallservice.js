// const { admins } = require("../../config.json")
// const Service = require('node-windows').Service;
// module.exports = {
//     name: 'uninstallservice',
//     category: "Bot Admin Only",
//     execute(message, args, cmd, client) {
//         if (!admins.includes(message.author.id)) return;
//         message.reply('uninstalling the service...')
//         client.svc.uninstall();
//         message.reply('service uninstalled')
//     }
// }