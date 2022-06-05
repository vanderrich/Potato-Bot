import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed, GuildMemberRoleManager, GuildBasedChannel } from "discord.js";

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
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction) {
        const targetuser = interaction.options.getMember("target");
        const role = interaction.options.getRole("role");
        const channel = interaction.guild?.channels.cache.find((channel: GuildBasedChannel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");

        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply("Could not find a mod channel!");
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        if (!targetuser || !(targetuser.roles instanceof GuildMemberRoleManager)) return interaction.reply("You must specify a user!");
        if (!role) return interaction.reply("You must specify a role!");

        //remove role
        const roleEmbed = new MessageEmbed()
            .setTitle('Remove Role')
            .addField('Role', `${role}`)
            .addField('User', `${targetuser}`)
            .setFooter({ text: `Removed by ${interaction.user.tag}` })
        targetuser.roles.remove(role.id)
        channel.send({ embeds: [roleEmbed] })
    }
}