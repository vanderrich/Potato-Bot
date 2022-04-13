const { admins } = require("../../config.json")
require("dotenv").config();
const token = process.env.DISCORD_TOKEN;

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