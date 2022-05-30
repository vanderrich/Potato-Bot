import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildBasedChannel, GuildMember, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption(option =>
            option
                .setName("target")
                .setDescription("The user to kick.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the kick.")
                .setRequired(false)
        ),
    permissions: "KICK_MEMBERS",
    category: "Moderation",
    async execute(interaction: CommandInteraction) {
        //initialize
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        const channel = interaction.guild.channels.cache.find((channel: GuildBasedChannel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");
        const member = interaction.options.getMember("target");
        const reason = interaction.options.getString("reason") || "No reason provided.";

        //conditions
        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply("Could not find a mod channel!");
        if (!member || !(member instanceof GuildMember)) return interaction.reply("Provide a valid member!");

        //kick
        const kickEmbed = new MessageEmbed()
            .setTitle("Kick")
            .addField("Kicked user", `${member}`)
            .addField("Reason", `${reason}`)
            .setFooter({ text: `Kicked by ${interaction.user.tag}` })
            .setTimestamp();
        interaction.guild.members.kick(member, reason);
        channel.send({ embeds: [kickEmbed] });
    }
}