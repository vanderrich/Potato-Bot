import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildMember, MessageEmbed, TextChannel } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a user")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to mute.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the mute.")
                .setRequired(false)
        ),
    permissions: 'MANAGE_MESSAGES',
    category: "Moderation",
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        //initialize
        const channel = interaction.guild.channels.cache.find(channel => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
        const member = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "No reason given";
        const muteRole = interaction.guild.roles.cache.find(role => role.name.includes("mute"));

        //conditions
        if (!channel || !(channel instanceof TextChannel)) return interaction.reply("Could not find a mod channel!");
        if (!member || !(member instanceof GuildMember)) return interaction.reply("Provide a valid member!");
        if (!muteRole) return interaction.reply("Could not find a mute role!");

        //mute
        const muteEmbed = new MessageEmbed()
            .setTitle("Mute")
            .addField("Muted user", `${member}`)
            .addField("Reason", `${reason}`)
            .setFooter({ text: `Muted by ${interaction.user.tag}` })
            .setTimestamp();
        member.roles.add(muteRole.id);
        channel.send({ embeds: [muteEmbed] });
    }
}