const { MessageEmbed } = require("discord.js")
const { jobsEmbed, jobsPure, footers } = require("../../config.json")
const { SlashCommandBuilder } = require("@discordjs/builders");
const jobEmbed = new MessageEmbed()
  .setTitle("Jobs")
  .addFields(jobsEmbed)
  .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn money!")
    .addStringOption(option =>
      option
        .setName("job")
        .setDescription("The job you want to work (`none` for no job)"),
  ),
  category: "Currency",
  async execute(interaction, client) {
    let result = await client.eco.work({
      user: interaction.guild.id,
      maxAmount: 100,
      replies: ['Potato Peeler', 'Janitor'],
      cooldown: 25
    });
    if (result.error) return interaction.reply(`You're too tired, Try again in ${result.time}`);
    else interaction.reply(`You worked as a ${result.workType} and earned **$${result.amount}**.`)
  }
}