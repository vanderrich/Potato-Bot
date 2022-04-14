const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("bal")
    .setDescription("Check your balance.")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to check the balance of.")
        .setRequired(true)
  ),
  category: "Currency",
  async execute(interaction, client, Discord, footers) {
    let user = interaction.options.getUser("target");
    let userBalance = await client.eco.fetchMoney(user.id ? user.id : user, false);
    const embed = new Discord.MessageEmbed()
      .setTitle(`Balance`)
      .addField(`User`, `${user.id ? user : `<@${user}>`}`)
      .addField(`Balance`, `${userBalance} 💸`)
      .setColor("RANDOM")
      .setThumbnail(user.displayAvatarURL)
      .setFooter({ text: footers[Math.floor(Math.random() * footers.length)], iconURL: interaction.user.avatarURL({ dynamic: true }) })
      .setTimestamp()
    return interaction.reply({ embeds: [embed] })
  }
}
