import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageEmbed } from "discord.js";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("dice")
        .setDescription("Rolls a die.")
        .addNumberOption(option => option
            .setName("number")
            .setDescription("The number of dice to roll.")
        )
        .addNumberOption(option => option
            .setName("sides")
            .setDescription("The number of sides on the dice.")
        )
        .addNumberOption(option => option
            .setName("modifier")
            .setDescription("The modifier to add to the dice.")
        )
        .addStringOption(option => option
            .setName("note")
            .setDescription("A note to add to the roll.")
        )
        .addStringOption(option => option
            .setName("assign")
            .setDescription("Assign each number to something, syntax: <number>=<text>, separate with commas.")
        ) as SlashCommandBuilder,
    category: "Fun",
    execute: (interaction, client, footers) => {
        const number = interaction.options.getNumber("number") || 1;
        const sides = interaction.options.getNumber("sides") || 6;
        if (number > 10000) return interaction.reply("Too many dices.");
        if (sides > 10000) return interaction.reply("Too big of a die.");
        const modifier = interaction.options.getNumber("modifier") || 0;
        let assign: any = interaction.options.getString("assign");
        if (assign) {
            assign = assign.split(",");
            assign = new Map(assign.map((a: string) => a.split("=").map(a => parseInt(a) || a)));
        }
        const rolls = [];
        for (let i = 0; i < number; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }
        const total = rolls.reduce((a, b) => a + b, 0) + modifier;
        const embed = new MessageEmbed()
            .setTitle(`${number}d${sides}${modifier ? `+${modifier}` : ""}`)
            .setDescription(`**${interaction.options.getString("note") || "Result"}**: ${rolls.join(", ")} = **${total}**${assign?.has(total) ? `\n**${assign.get(total)}**` : ""
                }`)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        if (!embed.description || embed.description.length > 4096) {
            return interaction.reply("Embed description too big! Try rolling a smaller dice.");
        }
        return interaction.reply({ embeds: [embed] });
    }
} as SlashCommand;