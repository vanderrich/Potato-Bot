import { SlashCommandBuilder } from "@discordjs/builders";
import config from "../../config.json";
import { GuildSettings, SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tag")
        .setDescription("Send a tag")
        .addStringOption(option => option
            .setName("tag")
            .setDescription("The tag to send")
            .setAutocomplete(true)
            .setRequired(true)
        )
        .addUserOption(option => option
            .setName("target")
            .setDescription("user to ping")
        ) as SlashCommandBuilder,
    category: "Info",
    async execute(interaction, client) {
        await interaction.deferReply();
        const tag = interaction.options.getString("tag");
        if (!tag) return interaction.editReply("You need to specify a tag");
        const target = interaction.options.getUser("target");

        let tagToSend;
        if (!config.tagDescriptions[tag]) {
            const guildSetting: GuildSettings | null = await client.guildSettings.findOne({ guildId: interaction.guildId })
            guildSetting?.tagDescriptions[tag];
        }
        else {
            tagToSend = config.tagDescriptions[tag]
        }
        if (!tagToSend) return interaction.editReply("Tag not found");

        if (target) {
            interaction.editReply(`*Tag suggestion for ${target}*\n\n${tagToSend}`);
        } else {
            interaction.editReply(tagToSend);
        }
    }
} as SlashCommand;