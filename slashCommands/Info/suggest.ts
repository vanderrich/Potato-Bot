import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageEmbed } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest to a channel")
        .addStringOption(option =>
            option
                .setName("suggestion")
                .setDescription("The suggestion")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel to send the suggestion in")
                .setRequired(true)
        ),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const channel = interaction.options.getChannel("channel");
        const suggestion = interaction.options.getString("suggestion");
        if (!channel) return interaction.editReply("You need to specify a channel!");
        if (!suggestion) return interaction.editReply("You need to specify a suggestion!");
        if (channel.type !== "GUILD_TEXT") return interaction.editReply("That channel is not a text channel!");
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Suggestion")
            .setDescription(suggestion)
            .setTimestamp()
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
        await channel.send({ embeds: [embed] });
        interaction.editReply("Your suggestion has been sent!");
    }
}