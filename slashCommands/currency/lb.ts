import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lb")
        .setDescription("See the leaderboard!"),
    category: "Currency",
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        await interaction.deferReply();
        let leaderboard: { userID: string, wallet: number, bank: number, total: number }[] = await client.eco.globalLeaderboard();
        if (!leaderboard || leaderboard.length < 1) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.leaderboard.empty"));

        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction.user.id, "commands.currency.lb.title"))
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

        let pos = 0;
        leaderboard.slice(0, 10).forEach(user => {
            const userObject = client.users.cache.get(user.userID);
            if (!userObject) return;
            pos++
            embed.addField(
                `${pos} - **${userObject.username}**`,
                client.getLocale(interaction.user.id, "commands.currency.lb.userDesc", user.wallet, user.bank)
            );
        });
        return interaction.editReply({ embeds: [embed] })
    }
} as SlashCommand;