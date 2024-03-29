import { SlashCommandBuilder } from "@discordjs/builders";
import { AnyChannel, MessageEmbed } from "discord.js";
import { GuildSettings, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest to a channel")
        .addStringOption(option =>
            option
                .setName("suggestion")
                .setDescription("The suggestion")
                .setRequired(true)
        ) as SlashCommandBuilder,
    category: "Info",
    guildOnly: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply();
        const guildSettings: GuildSettings | null | undefined = await client.guildSettings.findOne({ guildId: interaction.guild!.id });
        if (!guildSettings?.suggestionChannel) return interaction.editReply(client.getLocale(interaction, "commands.info.suggest.noChannel"));
        const channel: AnyChannel | undefined = client.channels.cache.get(guildSettings.suggestionChannel);
        const suggestion = interaction.options.getString("suggestion");
        if (!suggestion) return interaction.editReply(client.getLocale(interaction, "commands.info.suggest.noSuggestion"));
        if (!channel || !channel.isText()) return
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(client.getLocale(interaction, "commands.info.suggest.embedTitle"))
            .setDescription(suggestion)
            .setTimestamp()
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setThumbnail(client.user?.displayAvatarURL({ format: "png" })!)
        await channel.send({ embeds: [embed] });
        interaction.editReply(client.getLocale(interaction, "commands.info.suggest.success"));
    }
} as SlashCommand;