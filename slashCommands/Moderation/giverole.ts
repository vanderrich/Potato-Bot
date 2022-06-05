import { SlashCommandBuilder } from "@discordjs/builders";
import { Channel, CommandInteraction, GuildBasedChannel, GuildMemberRoleManager, MessageEmbed, TextChannel } from "discord.js";

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
    permissions: 'MANAGE_MEMBERS',
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction) {
        //variables
        const targetMember = interaction.options.getMember("target");
        const role = interaction.options.getRole("role")
        if (!targetMember || !(targetMember.roles instanceof GuildMemberRoleManager)) return interaction.reply("Provide a valid member!");
        if (!role) return interaction.reply("Provide a role!");
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        const channel = interaction.guild.channels.cache.find((channel: GuildBasedChannel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply("Could not find a mod channel!");

        //role
        const roleEmbed = new MessageEmbed()
            .setTitle('Give Role')
            .addField('Role', `${role}`)
            .addField('User', `${targetMember}`)
            .setFooter({ text: `Given by ${interaction.user.tag}` })
        targetMember.roles.add(role.id)
        channel.send({ embeds: [roleEmbed] })
    }
}