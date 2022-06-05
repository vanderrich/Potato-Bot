import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildBasedChannel, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user")
        .addStringOption(option =>
            option
                .setName("target")
                .setDescription("The userID to unban.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("The reason for the unban.")
                .setRequired(false)
        ),
    permissions: 'BAN_MEMBERS',
    category: "Moderation",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any) {
        if (!interaction.guild) return interaction.reply("This command can only be used in a guild.");
        //initialize
        const user = interaction.options.getString("target");
        const reason = interaction.options.getString("reason") || "No reason provided.";
        const channel = interaction.guild.channels.cache.find((channel: GuildBasedChannel) => channel.name.includes("mod") && channel.type === "GUILD_TEXT");

        //conditions
        if (!channel || channel.type !== "GUILD_TEXT") return interaction.reply("Could not find a mod channel!");
        if (!user) return interaction.reply("Please provide a userID to unban.");

        //kick
        const banEmbed = new MessageEmbed()
            .setTitle("Unban")
            .addField("Unbanned user", `<@${user}>`)
            .addField("Reason", reason)
            .setFooter({ text: `Unbanned by ${interaction.user.tag}` })
            .setTimestamp();
        interaction.guild?.members.unban(user);
        channel.send({ embeds: [banEmbed] });
    }
}