const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("monthly")
        .setDescription("Get your monthly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction, client) {
        let amount = Math.floor(Math.random() * 500) + 1000;
        let addMoney = await client.eco.monthly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(`You have already claimed your monthly credit. Come back in ${addMoney.time} to claim it again.`);
        else return interaction.reply(`You have claimed **$${addMoney.amount}** as your monthly credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
    }
}