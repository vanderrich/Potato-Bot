const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removerole")
        .setDescription("Remove a role from a user.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to remove the role from.")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("The role to remove.")
                .setRequired(true)
        ),
    permissions: "MANAGE_ROLES",
    async execute(interaction) {
        const targetuser = interaction.options.getUser("target");
        const { guild } = interaction
        const role = interaction.options.getRole("role")

        //remove role
        const roleEmbed = new Discord.MessageEmbed()
            .setTitle('Remove Role')
            .addField('Role', `${role}`)
        const member = guild.members.cache.get(targetuser.id)
        member.roles.remove(role.id)
        channel.send({ embeds: [roleEmbed] })
    }
}