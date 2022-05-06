const { SlashCommandSubcommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("hourly")
        .setDescription("Get your hourly reward!"),
    category: "Currency",
    async execute(interaction, client) {
        let amount = Math.floor(Math.random() * 2.0833333333333335 + 0.4166666666666667);
        let addMoney = await client.eco.hourly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(`You have already claimed your hourly credit. Come back in ${addMoney.time} to claim it again.`);
        else return interaction.reply(`You have claimed **${addMoney.amount}** 💸 as your hourly credit, You now have ${addMoney.rawData.networth}.`);
    }
}