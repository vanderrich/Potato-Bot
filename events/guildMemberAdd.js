const {welcomeMessages} = require('../config.json')
const Discord = require("discord.js")
module.exports = {
  name: 'guildMemberAdd',
  execute(newMember){
    function stringTemplateParser(expression, valueObj) {
      const templateMatcher = /{{\s?([^{}\s]*)\s?}}/g;
      let text = expression.replace(templateMatcher, (substring, value, index) => {
        value = valueObj[value];
        return value;
      });
      return text
    }
    const welcomeChannel = newMember.guild.channels.cache.find(channel => channel.name === 'welcome')

    if (newMember.bot) return;

    const embed = new Discord.MessageEmbed()
      .setTitle('New Member!')
      .setThumbnail(newMember.user.avatarURL())
      
    welcomeChannel.send(embed)
  }
}