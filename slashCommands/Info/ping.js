const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!'),
    category: "Info",
    async execute(interaction, client, Discord, footers) {
        const embed = new Discord.MessageEmbed()
        const ping = Date.now() - interaction.createdAt
        const fieldMessage = (ping < 0) ? "How much caffeine did i drink?" : (ping < 1) ? "Lightning Fast" : (ping < 5) ? "Very Fast" : (ping < 10) ? "Quite Fast" : (ping < 15) ? "Fast" : (ping < 50) ? "Moderately Fast" : (ping < 100) ? "Faster than normal" : (ping < 500) ? "Normal" : (ping < 1000) ? "Slower than normal" : (ping < 2500) ? "Quite Slow" : (ping < 5000) ? "Very Slow" : (ping < 10000) ? "Insanely Slow" : "Is the bot dead???"
        embed.setTitle("Pong!")
        embed.setDescription(`**Ping is ${ping}ms. API Latency is ${Math.round(client.ws.ping)}ms**`);
        embed.addField("In words", `${fieldMessage}`, true)
        embed.setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
        interaction.reply({ embeds: [embed] });
    },
};