import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('links')
        .setDescription('Links'),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const embed = new MessageEmbed()
            .setTitle("Links")
            .setDescription(`[**Github**](https://github.com/vanderrich/Potato-Bot)\n[**Discord Server**](https://discord.gg/cHj7nErGBa)\n[**Invite**](https://discord.com/api/oauth2/authorize?client_id=894060283373449317&permissions=8&scope=bot%20applications.commands)\n[**Trello**](https://trello.com/b/65PWS20u)`)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        interaction.reply({ embeds: [embed] });
    },
};