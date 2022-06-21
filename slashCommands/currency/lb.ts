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
        let leaderboard = await client.eco.globalLeaderboard();
        if (!leaderboard || leaderboard.length < 1) return interaction.editReply(client.getLocale(interaction.user.id, "commands.currency.leaderboard.empty"));

        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction.user.id, "commands.currency.lb.title"))
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

        let pos = 0;
        leaderboard.slice(0, 10).map(async (user: any) => {
            const userObject = await client.users.fetch(user.user);
            pos++
            embed.addField(
                `${pos} - **${userObject.username}**`,
                client.getLocale(interaction.user.id, "commands.currency.leaderboard.userDesc", user.wallet, user.bank)
            );

            return interaction.editReply({ embeds: [embed] })
        })
    }
} as SlashCommand;