const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("giverole")
    .setDescription("Give a role to a user")
    .addUserOption(option =>
      option
        .setName("target")
        .setDescription("The user to give the role to.")
        .setRequired(true)
    )
    .addRoleOption(option =>
      option
        .setName("role")
        .setDescription("The role to give the user.")
        .setRequired(true)
    ),
  permission: 'MANAGE_MEMBERS',
  async execute(message, args, cmd, client, Discord) {
    //variables
    const targetuser = interaction.options.getUser("target");
    args.shift()
    const rolename = args.join(' ')
    const { guild } = message
    const role = interaction.options.getRole("role")
    var channel = message.guild.channels.cache.find(channel => channel.name.includes("mod"));

    //role
    const roleEmbed = new Discord.MessageEmbed()
      .setTitle('Give Role')
      .addField('Role', `${role}`)
      .addField('User', `${targetuser}`)
      .setFooter({ text: `Given by ${interaction.user.tag}`, iconURL: interaction.user.avatarURL({ dynamic: true }) })
    const member = guild.members.cache.get(targetuser.id)
    member.roles.add(role.id)
    channel.send({ embeds: [roleEmbed] })
  }
}