import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import config from "../../config.json"
import { Client, GuildSettings, SlashCommand } from "../../Util/types";

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
    async execute(interaction: CommandInteraction, client: Client) {
        const tag = interaction.options.getString("tag");
        if (!tag) return interaction.reply("You need to specify a tag");
        const target = interaction.options.getUser("target");

        let tagToSend;
        if (!config.tagDescriptions[tag]) {
            const guildSetting: GuildSettings | null = await client.guildSettings.findOne({ guildId: interaction.guildId })
            guildSetting?.tagDescriptions[tag];
        }
        else {
            tagToSend = config.tagDescriptions[tag]
        }
        if (!tagToSend) return interaction.reply("Tag not found");

        if (target) {
            interaction.reply(`*Tag suggestion for ${target}*\n\n${tagToSend}`);
        } else {
            interaction.reply(tagToSend);
        }
    }
} as SlashCommand;