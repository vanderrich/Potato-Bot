import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction, MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { Client, GuildSettings, SlashCommand } from "../../Util/types"
module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("View and edit your settings."),
    category: "Moderation",
    permissions: "MANAGE_GUILD",
    guildOnly: true,
    async execute(interaction: CommandInteraction, client: Client, footers: string[]) {
        await interaction.deferReply()
        const guildSettings: GuildSettings | null = await client.guildSettings.findOne({ guildId: interaction.guild!.id });
        const locale = client.getLocale(interaction.user.id, "commands.moderation.settings");
        if (!guildSettings) return interaction.reply(locale.noSettings)
        console.log(locale);
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction.user.id, "commands.moderation.settings.settings", interaction.guild!.name))
            .addField(locale.badWords,
                `**${locale.badWordsSpoilers}**: || ${guildSettings.badWords.join(", ")}|| `)
            .addField(locale.welcome,
                `**${locale.welcomeMessage}**: ${guildSettings.welcomeMessage}
                **${locale.welcomeChannel}**: ${interaction.guild!.channels.cache.get(guildSettings.welcomeChannel)}
                **${locale.welcomeRole}**: ${interaction.guild!.roles.cache.get(guildSettings.welcomeRole)} `)
            .addField(locale.tags,
                `**${locale.tags}**: ${guildSettings.tags.map((tag: { name: String, value: String }) => `${tag.name}: ${tag.value}`).join("\n")}
                **${locale.tagDescriptions}**: ${Object.keys(guildSettings.tagDescriptions).map(tag => `${tag}: ${guildSettings.tagDescriptions[tag as keyof typeof guildSettings.tagDescriptions]}`).join("\n")} `)
            .addField("Misc",
                `**${locale.suggestionChannel}**: ${interaction.guild!.channels.cache.get(guildSettings.suggestionChannel)}
                **${locale.ghostPing}**: ${guildSettings.ghostPing || true}
                // **${locale.statChannels}**: ${guildSettings.statChannels.map(channel => interaction.guild!.channels.cache.get(channel)?.toString).join(", ")}
                `)
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });

        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("settings")
                    .addOptions([
                        { label: locale.badWords, value: "badWords" },
                        { label: locale.welcome, value: "welcome" },
                        { label: locale.tags, value: "tags" },
                        { label: locale.misc, value: "misc" }
                    ])
            )

        interaction.editReply({ embeds: [embed], components: [actionRow] });
    }
} as SlashCommand;