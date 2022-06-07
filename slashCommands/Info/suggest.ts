import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, GuildTextBasedChannel, MessageEmbed } from "discord.js";


type GuildSettings = {
    guildId: string,
    badWords: string[],
    autoPublishChannels: string[],
    welcomeMessage: string,
    welcomeChannel: string,
    welcomeRole: string,
    suggestionChannel: string,
    tags: { name: String, value: String }[],
    tagDescriptions: Object,
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suggest")
        .setDescription("Suggest to a channel")
        .addStringOption(option =>
            option
                .setName("suggestion")
                .setDescription("The suggestion")
                .setRequired(true)
        ),
    category: "Info",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const guildSettings: GuildSettings | undefined = await client.guildSettings.findOne(interaction.guild!.id);
        if (!guildSettings?.suggestionChannel) return interaction.reply(client.getLocales(interaction.user.id, "commands.info.suggest.noChannel"));
        const channel: GuildTextBasedChannel = client.channels.cache.get(guildSettings.suggestionChannel);
        const suggestion = interaction.options.getString("suggestion");
        if (!suggestion) return interaction.reply(client.getLocales(interaction.user.id, "commands.info.suggest.noSuggestion"));
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle(client.getLocales(interaction.user.id, "commands.info.suggest.embedTitle"))
            .setDescription(suggestion)
            .setTimestamp()
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
            .setThumbnail(client.user.displayAvatarURL({ format: "png" }))
        await channel.send({ embeds: [embed] });
        interaction.reply(client.getLocales(interaction.user.id, "commands.info.suggest.success"));
    }
}