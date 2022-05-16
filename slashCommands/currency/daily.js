const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("daily")
        .setDescription("Get your daily reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction, client) {
        let amount = Math.floor(Math.random() * 50) + 10;
        let addMoney = await client.eco.daily({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(`You have already claimed your daily credit. Come back in ${addMoney.time} to claim it again.`);
        else return interaction.reply(`You have claimed **$${addMoney.amount}** as your daily credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
    }
}