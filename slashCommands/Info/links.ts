import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Links'),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction.user.id, "commands.info.links.embedTitle"))
            .setDescription(`
            [**${client.getLocale(interaction.user.id, "commands.info.links.github")}**](https://github.com/vanderrich/Potato-Bot)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.discServer")}**](https://discord.gg/cHj7nErGBa)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.invite")}**](https://discord.com/api/oauth2/authorize?client_id=894060283373449317&permissions=8&scope=bot%20applications.commands)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.trello")}**](https://trello.com/b/65PWS20u)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.topgg")}**](https://top.gg/bot/894060283373449317)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.discBots")}**](https://discord.bots.gg/bots/894060283373449317)\n
            [**${client.getLocale(interaction.user.id, "commands.info.links.discBotList")}**](https://discordbotlist.com/bots/potato-bot-1627/upvote)\n
            `)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.reply({ embeds: [embed] });
    },
};