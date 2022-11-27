//not used anymore
import { SlashCommandSubcommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("tags")
        .setDescription("Tags")
        .addStringOption(option => option
            .setName("action")
            .setDescription("The action to perform")
            .addChoices(
                { name: "add", value: "add" },
                { name: "remove", value: "remove" },
            )
            .setRequired(true)
        )
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
        ),
    category: "Moderation",
    permission: "MANAGE_GUILD",
    isSubcommand: true,
    async execute(interaction, client) {
        const tag = interaction.options.getString("tag");
        const customid = interaction.options.getString("customid")?.toLowerCase().replace(/ /g, "");
        const value = interaction.options.getString("value");
        const action = interaction.options.getString("action");
        if (!tag || !customid || (!value && action == "add")) return interaction.reply("You must provide a tag, customid, and value.");
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild.id });

        if (!guildSettings) {
            const guildSettings = new client.guildSettings({
                guildId: interaction.guild.id,
                tags: [{
                    name: tag,
                    value: customid
                }],
                tagDescriptions: {
                    [customid]: value
                }
            });
            await guildSettings.save();
            interaction.reply(`Created setting with the tag ${tag} with customid ${customid} and value ${value}`);
        } else {
            if (action === "add") {
                if (!guildSettings.tags) guildSettings.tags = [];
                if (!guildSettings.tagDescriptions) guildSettings.tagDescriptions = new Map;
                guildSettings.tags.push({ name: tag, value: customid });
                guildSettings.tagDescriptions.set(customid, value!);
            } else if (action === "remove") {
                guildSettings.tags = guildSettings.tags.filter((t: any) => t.name !== tag && t.value !== customid);
                guildSettings.tagDescriptions.delete(customid);
            }
            guildSettings.save();
            interaction.reply(`Successfully ${action == "add" ? "added" : "removed"} the tag **${tag}** with the custom id **${customid}** ${action == "add" ? `and value **${value}**` : ''} `);
        }
    }
} as SlashCommand;