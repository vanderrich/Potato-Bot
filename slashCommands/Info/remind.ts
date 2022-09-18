import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import ms from "ms";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("remind")
        .setDescription("Sets a reminder")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("The name of the reminder")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("time")
                .setDescription("When to remind")
                .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction) {
        const name = interaction.options.getString("name")!;
        let time: number;
        try {
            time = ms(interaction.options.getString("time")!) + Date.now()
            if (!time) throw Error();
        } catch {
            return interaction.reply("Invalid Time!")
        }
        setTimeout(() => {
            const embed = new MessageEmbed()
                .setTitle(name)
            interaction.followUp({ content: `${interaction.user}`, embeds: [embed] })
        }, time);
        interaction.reply("Successfully created reminder!")
    }
} as SlashCommand;