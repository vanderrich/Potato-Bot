const { admins, token } = require("../../config.json")
const Service = require('node-windows').Service;
module.exports = {
    name: 'restart',
    aliases: ['reset'],
    category: "Bot Admin Only",
    execute(message, args, cmd, client) {
        if (!admins.includes(message.author.id)) return;
        message.reply("Resetting...");
        client.destroy();
        client.login(token);
    }
}