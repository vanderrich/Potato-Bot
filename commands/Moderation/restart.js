const { admins, token } = require("../../config.json")
module.exports = {
    name: 'restart',
    aliases: ['reset'],
    category: "Info",
    execute(message, args, cmd, client) {
        if (!admins.includes(message.author.id)) return;
        message.reply("Resetting...");
        client.destroy();
        client.login(token);
    },
};