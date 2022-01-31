const {MessageEmbed} = require("discord.js")
const {jobs} = require("../../config.json")
const jobEmbed = new MessageEmbed()
  .setTitle("Jobs")
  .addFields(jobs)
module.exports = {
  name: "work",
  aliases: [],
  usage: "work",
  cooldown: 3600,
  async execute(message, args, cmd, client){
    var inputedJob = args[0]
    if(args[1]){
      inputedJob += " " + args[1]
    }
    if(!client.job.get(`job_${message.author.id}`)){
      for(let i = 0; i<jobsPure.length; i++){
        if (jobsPure[i].name === inputedJob){
          let job = jobsPure[i];
        }
      }
      if(job){
        if(client.inv.get(`item_${message.author.id}`).includes(job.requires))return message.channel.send("You dont have the proper tool for that job!")
        client.job.push(`job_${message.author.id}`, inputedJob)
        return message.channel.send("You are now working as a " + inputedJob)
      }
      return message.channel.send(jobEmbed)
    }
    if(inputedJob == "none"){
      client.job.delete(`job_${message.author.id}`)
      return message.channel.send("You're jobless now")
    }
    let job = client.job.get(`job_${message.author.id}`)
    let amount = Math.floor(Math.random() * job.salary.max) + job.salary.min;
    let work = client.eco.work(message.author.id, message.guildId, amount, {});
    if (work.cooldown) return message.reply(`You are tired rn. Come back after ${work.time.minutes} minutes & ${work.time.seconds} seconds to work again.`);
    else return message.reply(`You worked as **${job}** and earned **${amount}** 💸.`);
  }
}