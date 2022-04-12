module.exports = {
    name: "monthly",
    category: "Currency",
    async execute(message, args, cmd, client) {
        let amount = Math.floor(Math.random() * 50) + 10;
        let addMoney = await client.eco.monthly(message.author.id, false, amount, {});
        if (addMoney.cooldown) return message.reply(`You have already claimed your monthly credit. Come back after ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
        else return message.reply(`You have claimed **${addMoney.amount}** 💸 as your monthly credit & now you have **${addMoney.money}** 💸.`);
    }
}