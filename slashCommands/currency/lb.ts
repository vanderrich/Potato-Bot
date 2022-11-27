import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lb")
        .setDescription("See the leaderboard!"),
    category: "Currency",
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const leaderboard: { userID: string, wallet: number, bank: number, networth: number }[] = await client.eco.globalLeaderboard();
        if (!leaderboard || leaderboard.length < 1) return interaction.editReply(client.getLocale(interaction, "commands.currency.leaderboard.empty"));

        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction, "commands.currency.lb.title"))
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

        let pos = 0;
        leaderboard.slice(0, 10).forEach(user => {
            const userObject = client.users.cache.get(user.userID);
            if (!userObject) return;
            pos++
            embed.addFields({
                name: `${pos} - **${userObject.username}**`,
                value: client.getLocale(interaction, "commands.currency.lb.userDesc", user.wallet, user.bank, user.networth)
            });
        });
        return interaction.editReply({ embeds: [embed] })
    }
} as SlashCommand;