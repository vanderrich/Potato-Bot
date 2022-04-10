const { MessageEmbed } = require("discord.js")
const { jobsEmbed, jobsPure, footers } = require("../../config.json")
const jobEmbed = new MessageEmbed()
  .setTitle("Jobs")
  .addFields(jobsEmbed)
  .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })

module.exports = {
  name: "work",
  aliases: [],
  usage: "work",
  category: "Currency",
  execute(message, args, cmd, client, Discord) {
    var inputedJob = args[0]
    if (args[1]) {
      inputedJob += " " + args[1]
    }
    if (!client.job.get(`job_${message.author.id}`)) {
      let job
      for (let i = 0; i < jobsPure.length; i++) {
        if (jobsPure[i].name.toLowerCase() === inputedJob) {
          job = jobsPure[i];
        }
      }
      if (job) {
        if (client.db.get(`item_${message.author.id}`).includes(job.requires)) return message.reply("You dont have the proper tool for that job!")
        client.job.push(`job_${message.author.id}`, inputedJob)
        return message.reply(`You are now working as a ${inputedJob}`)
      }
      return message.reply({ embeds: [jobEmbed] })
    }
    if (inputedJob == "none") {
      client.job.delete(`job_${message.author.id}`)
      return message.reply("You're jobless now")
    }
    let job = client.job.get(`job_${message.author.id}`)
    let amount = Math.floor(Math.random() * job.salary.max) + job.salary.min;
    let work = client.eco.work(message.author.id, false, amount, {});
    if (work.cooldown) return message.reply(`You are tired rn. Come back after ${work.time.minutes} minutes & ${work.time.seconds} seconds to work again.`);
    else return message.reply(`You worked as **${job}** and earned **${amount}** 💸.`);
  }
}