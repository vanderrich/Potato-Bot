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
  execute(interaction, client) {
    var inputedJob = interaction.options.getString("job");
    if (!client.job.get(`job_${interaction.user.id}`)) {
      let job
      for (let i = 0; i < jobsPure.length; i++) {
        if (jobsPure[i].name.toLowerCase() === inputedJob) {
          job = jobsPure[i];
        }
      }
      if (job) {
        if (client.db.get(`items_${interaction.user.id}`).includes(job.requires)) return interaction.reply("You dont have the proper tool for that job!")
        client.job.push(`job_${interaction.user.id}`, inputedJob)
        return interaction.reply(`You are now working as a ${inputedJob}`)
      }
      return interaction.reply({ embeds: [jobEmbed] })
    }
    if (inputedJob == "none") {
      client.job.delete(`job_${interaction.user.id}`)
      return interaction.reply("You're jobless now")
    }
    let job = client.job.get(`job_${interaction.user.id}`)[0]
    jobsPure.forEach(jobPure => {
      if (jobPure.name.toLowerCase() == job) {
        job = jobPure;
      }
    })
    let amount = Math.floor(Math.random() * job.salary.max) + job.salary.min;
    let work = client.eco.work(interaction.user.id, false, amount, {});
    if (work.cooldown) return interaction.reply(`You are tired rn. Come back after ${work.time.minutes} minutes & ${work.time.seconds} seconds to work again.`);
    else return interaction.reply(`You worked as **${job.name}** and earned **${amount}** 💸.`);
  }
}