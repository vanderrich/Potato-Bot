import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Client, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),
    category: "Info",
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        const embed = new MessageEmbed()
        const ping = Date.now() - interaction.createdTimestamp
        const fieldMessages = client.getLocale(interaction, "commands.info.ping.fieldMsg")
        const fieldMessage = (ping < 0) ? fieldMessages["<0"] : (ping < 1) ? fieldMessages["<1"] : (ping < 5) ? fieldMessages["<5"] : (ping < 10) ? fieldMessages["<10"] : (ping < 15) ? fieldMessages["<15"] : (ping < 50) ? fieldMessages["<50"] : (ping < 100) ? fieldMessages["<100"] : (ping < 500) ? fieldMessages["<500"] : (ping < 1000) ? fieldMessages["<1000"] : (ping < 2500) ? fieldMessages["<2500"] : (ping < 5000) ? fieldMessages["<5000"] : (ping < 10000) ? fieldMessages["<10000"] : fieldMessages["else"]
        embed.setTitle("Pong!")
        embed.setDescription(client.getLocale(interaction, "commands.info.ping.embedDesc", ping, client.ws.ping));
        embed.addField(fieldMessages.title, `${fieldMessage}`, true)
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
        embed.setColor("RANDOM")
        interaction.reply({ embeds: [embed] });
    },
} as SlashCommand;