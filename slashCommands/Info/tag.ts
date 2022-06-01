import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import config from "../../config.json"
type tagTypeThingy = string & keyof typeof config.tagDescriptions;

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
        ),
    category: "Info",
    async execute(interaction: CommandInteraction, client: any) {
        const tag = interaction.options.getString("tag");
        if (!tag) return interaction.reply("You need to specify a tag");
        const tagTyped: tagTypeThingy = tag as tagTypeThingy;
        const target = interaction.options.getUser("target");

        const tagToSend = config.tagDescriptions[tagTyped] || (await client.guildSettings.findOne({ guildId: interaction.guildId }))?.tagDescriptions[tagTyped];
        if (!tagToSend) return interaction.reply("Tag not found");

        if (target) {
            interaction.reply(`*Tag suggestion for ${target}*\n\n${tagToSend}`);
        } else {
            interaction.reply(tagToSend);
        }
    }
}