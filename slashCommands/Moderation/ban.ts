import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildBasedChannel, GuildMember, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a user from the server.")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to ban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the ban.")
                .setRequired(false)

        ),
    permissions: 'BAN_MEMBERS',
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction) {
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        //initialize
        const member = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "No reason provided.";
        const channel = interaction.guild.channels.cache.find((channel: GuildBasedChannel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");

        //conditions
        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply("Could not find a mod channel!");
        if (!member || !(member instanceof GuildMember)) return interaction.reply("Please provide a user to ban.");

        //ban
        var banEmbed = new MessageEmbed()
            .setTitle("Ban")
            .addField("Banned user", `<@${member.id}>`)
            .addField("Reason", reason)
            .setFooter({ text: `Banned by ${interaction.user.tag}` })
            .setTimestamp();
        interaction.guild.members.ban(member, { reason: reason });
        channel.send({ embeds: [banEmbed] });
    }
}