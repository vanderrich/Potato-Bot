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
            time = ms(interaction.options.getString("time")!)
            if (!time) throw Error();
            if (time < 5000) return interaction.reply("Time too short!")
        } catch {
            return interaction.reply("Invalid Time!")
        }
        interaction.reply("Successfully created reminder!\n\nFYI: Your reminder will be gone once the bot restarts.")
        setTimeout(() => {
            const embed = new MessageEmbed()
                .setTitle(name)
            interaction.followUp({ content: `${interaction.user}`, embeds: [embed] })
        }, time);
    }
} as SlashCommand;