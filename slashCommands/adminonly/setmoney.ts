import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { admins } from "../../config.json";
import { SlashCommand } from "../../Util/types";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setmoney")
        .setDescription("Set the balance of a user.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to set the balance of.")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The amount of money to set.")
                .setRequired(true)
        ) as SlashCommandBuilder,
    permissions: "BotAdmin",
    category: "Bot Admin Only",
    async execute(interaction, client, footers) {
        if (!admins.includes(interaction.user.id)) return; // return if author isn't bot owner
        let user = interaction.options.getUser("target");
        if (!user) return interaction.reply("Please specify a user!");
        let amount = interaction.options.getInteger("amount");
        let data = await client.eco.setMoney({ userId: interaction.user.id, wheretoputmoney: "wallet", amount });

        const embed = new MessageEmbed()
            .setTitle(`Money Added!`)
            .setDescription(`User: <@${user.id}>\nTotal Amount: ${data}`)
            .setColor("RANDOM")
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        return interaction.reply({ embeds: [embed] })
    }
} as SlashCommand;