import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageEmbed, MessageSelectMenu } from "discord.js";
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
        const locale = client.getLocale(interaction, "commands.moderation.settings");
        if (!guildSetting) {
            guildSetting = new client.guildSettings({
                guildId: interaction.guildId
            })
            guildSetting.save()
        }
        if (!guildSetting) return
        const guildSettings = guildSetting;
        const embed = new MessageEmbed()
            .setTitle(client.getLocale(interaction, "commands.moderation.settings.settings", interaction.guild!.name))
            .addFields({
                name: locale.welcome, value: `**${locale.welcomeMessage}**: ${guildSettings.welcomeMessage}
                **${locale.welcomeChannel}**: ${interaction.guild!.channels.cache.get(guildSettings.welcomeChannel)}
                **${locale.welcomeRole}**: ${interaction.guild!.roles.cache.get(guildSettings.welcomeRole)} `
            }, {
                name: locale.tags,
                value:
                    `**${locale.tags}**: ${guildSettings.tags.map((tag: { name: String, value: String }) => `${tag.name}: ${tag.value}`).join("\n")}
                **${locale.tagDescriptions}**: ${Object.keys(guildSettings.tagDescriptions).map(tag => `${tag}: ${guildSettings.tagDescriptions[tag as keyof typeof guildSettings.tagDescriptions]}`).join("\n")
                    } `
            }, {
                name: "Misc",
                value: `**${locale.suggestionChannel}**: ${interaction.guild!.channels.cache.get(guildSettings.suggestionChannel)}
                **${locale.ghostPing}**: ${guildSettings.ghostPing || true}
                ** ${locale.statChannels}**: ${guildSettings.statChannels.map(statChannel => interaction.guild!.channels.cache.get(statChannel.channel)?.toString()).join(", ")}
                `})
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