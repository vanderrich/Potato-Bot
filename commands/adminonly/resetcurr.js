const { admins } = require("../../config.json")
module.exports = {
    name: "resetcurr",
    aliases: ["reset_currency", "resetcurrency"],
    category: "Bot Admin Only",
    async execute(message, args, cmd, client, Discord) {
        if (!admins.includes(message.author.id)) return; // return if author isn't bot owner
        message.reply("Are you sure you want to reset the database? Enter `potato-bot` to continue")
        const filter = m => m.content == 'potato-bot'
        await message.channel.awaitMessages({ filter, max: 1, time: 30_000, errors: ['time'] })
            .then(async () => {
                message.channel.send("Resetting database...")
                let result = await client.eco.reset();
                message.channel.send(result ? 'Reset successful' : 'Unable to reset database')
            }).catch(() => {
                message.channel.send("Reset canceled")
            })

    }
}