const { SlashCommandBuilder } = require("@discordjs/builders");

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
        ),
    category: "Fun",
    execute: (interaction, client, Discord, footers) => {
        const number = interaction.options.getNumber("number") || 1;
        const sides = interaction.options.getNumber("sides") || 6;
        const modifier = interaction.options.getNumber("modifier") || 0;
        const rolls = [];
        for (let i = 0; i < number; i++) {
            rolls.push(Math.floor(Math.random() * sides) + 1);
        }
        const total = rolls.reduce((a, b) => a + b, 0) + modifier;
        const embed = new Discord.MessageEmbed()
            .setTitle(`${number}d${sides}${modifier ? `+${modifier}` : ""}`)
            .setDescription(`${interaction.options.getString("note") || "Result"}: ${rolls.join(", ")} = ${total}`)
            .setColor('RANDOM')
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
        return interaction.reply({ embeds: [embed] });
    }
}