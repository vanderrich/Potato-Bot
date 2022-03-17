const { admins, token } = require("../../config.json")
const Service = require('node-windows').Service;
module.exports = {
    name: 'restart',
    aliases: ['reset'],
    category: "Info",
    execute(message, args, cmd, client) {
        if (!admins.includes(message.author.id)) return;
        message.reply("Resetting...");
        client.destroy();
        client.login(token);
        const svc = client.svc
        svc.uninstall()
        client.svc = new Service({
            name: 'Potato bot',
            description: 'potatoes',
            script: 'D:\\programing\\programming\\GitHub\\Potato-Bot\\index.js'
        });
    }
}