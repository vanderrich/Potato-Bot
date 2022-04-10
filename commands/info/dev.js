module.exports = {
  name: 'form',
  aliases: ['apply'],
  description: 'Complete a form made by the server admin',
  category: "Info",
  async execute(message, args, cmd, client, Discord) {
    // if (!client.form.has(message.guild.id)) {
    //   if (message.channel.permissionsFor(message.author).has('ADMINISTRATOR')) {
    //     message.reply("Form Creator")
    //     await message.reply("Enter a title for the Form").then({

    //     })
    //   }
    // }
    // const form = client.form.get(message.guild.id)
    // async function collector(type, time, max) {
    //   returned = []
    //   if (type == "reaction") {

    //   } else if (type == "message") {

    //   }
    //   const filter = m => m.author.id === message.author.id;
    //   const collector = channel.createMessageCollector({ filter, time: time }, max);
    //   collector.on('collect', m => returned.push(m));
    //   collector.on('end', collected => returned.push(collected.size));
    // }
  }
}