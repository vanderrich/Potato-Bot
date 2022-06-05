import { SlashCommandBuilder, ContextMenuCommandBuilder, ContextMenuCommandType } from "@discordjs/builders";
import { ApplicationCommandType } from "discord-api-types/v9";
import { CommandInteraction, ContextMenuInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("bal")
        .setDescription("Check your balance.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to check the balance of.")
                .setRequired(true)
        ),
    contextMenu: new ContextMenuCommandBuilder()
        .setName("bal")
        .setType(ApplicationCommandType.User),
    category: "Currency",
    async execute(interaction: ContextMenuInteraction | CommandInteraction, client: any, footers: Array<string>) {
        let user = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
        let userInfo = await client.eco.balance({ user: user.id });
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction.user.id, "commands.currency.bal.title", user.username))
            .addField(client.getLocale(interaction.user.id, "commands.currency.bal.wallet"), `${userInfo.wallet}`)
            .addField(client.getLocale(interaction.user.id, "commands.currency.bal.bank"), `${userInfo.bank}`)
            .addField(client.getLocale(interaction.user.id, "commands.currency.bal.total"), `${userInfo.networth}`)
            .setColor("RANDOM")
            .setThumbnail(user.displayAvatarURL)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setTimestamp()
        return interaction.reply({ embeds: [embed] })
    }
}
