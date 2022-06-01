import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("tags")
        .setDescription("Adds a tag to the database")
        .addStringOption(option => option
            .setName("tag")
            .setDescription("The tag to add")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("customid")
            .setDescription("The value of the tag in the options")
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName("value")
            .setDescription("The value of the tag to send")
            .setRequired(true)
        ),
    category: "Moderation",
    permission: "MANAGE_GUILD",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any, footers: string[]) {
        const tag = interaction.options.getString("tag");
        const customid = interaction.options.getString("customid")?.toLowerCase().replace(/ /g, "");
        const value = interaction.options.getString("value");
        if (!tag || !customid || !value) return interaction.reply("You must provide a tag, customid, and value.");
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild.id });

        if (!guildSettings) {
            const guildSettings = new client.guildSettings({
                guildId: interaction.guild.id,
                tags: [{
                    name: tag,
                    value: customid
                }]
            });
            guildSettings.tagDescription[customid] = value;
            guildSettings.save();
        } else {
            if (!guildSettings.tags)
                guildSettings.tags = [];
            if (!guildSettings.tagDescriptions)
                guildSettings.tagDescriptions = {};
            if (guildSettings.tags.find((t: any) => t.name === tag))
                return interaction.reply("That tag already exists!");

            guildSettings.tags.push({ name: tag, value: customid });
            guildSettings.tagDescriptions[customid] = value;
            guildSettings.save();
        }
        interaction.reply("Added tag.");
    }
}