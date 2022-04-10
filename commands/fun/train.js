const Tenor = require("tenorjs").client({
    "Key": "7O9J1ONOR5NH",
    "Filter": "off",
    "Locale": "en_US",
    "MediaFilter": "minimal",
    "DateFormat": "D/MM/YYYY - H:mm:ss A"
});
module.exports = {
    name: "train",
    description: "random thing idk",
    category: "Fun",
    execute(message, args, cmd, client, Discord) {
        message.reply("train weee")
        Tenor.Search.Query("train", "50").then(Results => {
            message.reply(Results[Math.floor(Math.random() * 50)].url)
        }).catch(console.error);
    }
}