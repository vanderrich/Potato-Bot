import { ContextMenuCommandBuilder, SlashCommandBuilder } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bal")
        .setDescription("Check your balance.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to check the balance of.")
                .setRequired(true)
        ) as SlashCommandBuilder,
    contextMenu: new ContextMenuCommandBuilder()
        .setName("bal")
        .setType(ApplicationCommandType.User),
    category: "Currency",
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const user = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
        if (!user) return;
        const userInfo = await client.eco.balance({ user: user.id });
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction, "commands.currency.bal.title", user.username))
            .setDescription(`${client.getLocale(interaction, "commands.currency.bal.wallet", userInfo.wallet)}\n${client.getLocale(interaction, "commands.currency.bal.bank", `${userInfo.bank}`)}\n${client.getLocale(interaction, "commands.currency.bal.total", `${userInfo.networth}`)}`)
            .setColor("RANDOM")
            .setThumbnail(user.displayAvatarURL())
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setTimestamp()
        return interaction.editReply({ embeds: [embed] })
    }
} as SlashCommand;