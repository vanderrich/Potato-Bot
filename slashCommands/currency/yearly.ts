import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("yearly")
        .setDescription("Get your yearly reward!"),
    category: "Currency",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        let amount = Math.floor(Math.random() * 6000) + 12000;
        let addMoney = await client.eco.yearly({ user: interaction.user.id, amount });
        if (addMoney.error) return interaction.reply(`You have already claimed your yearly credit. Come back in ${addMoney.time} to claim it again.`);
        else return interaction.reply(`You have claimed **$${addMoney.amount}** as your yearly credit, You now have **$${addMoney.rawData.wallet}** in your wallet.`);
    }
}