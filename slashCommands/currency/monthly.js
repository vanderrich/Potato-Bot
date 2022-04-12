const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("monthly")
        .setDescription("Get your monthly reward!"),
    async execute(interaction, client) {
        let amount = Math.floor(Math.random() * 500) + 1000;
        let addMoney = await client.eco.monthly(interaction.user.id, false, amount, {});
        if (addMoney.cooldown) return interaction.reply(`You have already claimed your monthly credit. Come back after ${addMoney.time.days} days, ${addMoney.time.hours} hours, ${addMoney.time.minutes} minutes & ${addMoney.time.seconds} seconds to claim it again.`);
        else return interaction.reply(`You have claimed **${addMoney.amount}** 💸 as your monthly credit & now you have **${addMoney.money}** 💸. `);
    }
}