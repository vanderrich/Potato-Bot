import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
import { Settings } from "../../localization";
import { SlashCommand } from "../../Util/types";
module.exports = {
    data: new SlashCommandBuilder()
        .setName("settings")
        .setDescription("View and edit your settings."),
    category: "Moderation",
    permissions: "MANAGE_GUILD",
    guildOnly: true,
    async execute(interaction, client, footers) {
        await interaction.deferReply()
        let guildSetting = await client.guildSettings.findOne({ guildId: interaction.guild!.id });
        const locale = client.getLocale(interaction, "commands.moderation.settings") as Settings;
        if (!guildSetting) {
            guildSetting = new client.guildSettings({
                guildId: interaction.guildId
            })
            guildSetting.save()
        }
        if (!guildSetting) return
        const guildSettings = guildSetting;
        const tags = guildSettings.tagDescriptions.keys();
        const tagsProcessed = []
        for (const tag of tags) {
            tagsProcessed.push(`${tag}: ${guildSettings.tagDescriptions[tag as keyof typeof guildSettings.tagDescriptions]}`);
        }
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction, "commands.moderation.settings.settings", interaction.guild!.name))
            .addFields({
                name: locale.welcome, value: `**${locale.welcomeMessage}**: ${guildSettings.welcomeMessage}
                **${locale.welcomeChannel}**: ${interaction.guild!.channels.cache.get(guildSettings.welcomeChannel!)}
                **${locale.welcomeRole}**: ${interaction.guild!.roles.cache.get(guildSettings.welcomeRole!)} `
            }, {
                name: locale.tags,
                value:
                    `**${locale.tags}**: ${guildSettings.tags.map((tag: { name: string, value: string }) => `${tag.name}: ${tag.value}`).join("\n")}
                **${locale.tagDescriptions}**: ${tagsProcessed.join("\n")}`
            }, {
                name: locale.statChannels, value:
                    `**${locale.statChannels} **: ${guildSettings.statChannels.map(statChannel => interaction.guild!.channels.cache.get(statChannel.channel)?.toString()).join(", ")}`
            }, {
                name: "Misc",
                value: `** ${locale.suggestionChannel} **: ${interaction.guild!.channels.cache.get(guildSettings.suggestionChannel!)}
            ** ${locale.ghostPing} **: ${guildSettings.ghostPing || true}`
            })
            .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });

        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                    .setCustomId("settings")
                    .addOptions([
                        { label: locale.welcome, value: "welcome" },
                        { label: locale.tags, value: "tags" },
                        { label: locale.misc, value: "misc" }
                    ])
            )

        interaction.editReply({ embeds: [embed], components: [actionRow] });
    }
} as SlashCommand;