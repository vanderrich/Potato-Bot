import { CommandInteraction } from "discord.js";
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("weekly")
        .setDescription("Get your weekly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        let amount = Math.floor(Math.random() * 100) + 50;
        let addMoney = await client.eco.weekly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(`You have already claimed your weekly credit. Come back in ${addMoney.time} to claim it again.`);
        else return interaction.reply(`You have claimed **$${addMoney.amount}** as your weekly credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
    }
}