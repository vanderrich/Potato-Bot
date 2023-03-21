import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("onlyimages")
        .setDescription("Only let users to send images")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("channel")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("add or remove")
                .addChoices(
                    { name: "add", value: "add" },
                    { name: "remove", value: "remove" }
                )
                .setRequired(true)
        ) as SlashCommandBuilder,
    permissions: "MANAGE_MESSAGES",
    category: "Moderation",
    guildOnly: true,
    async execute(interaction, client) {
        const channel = interaction.options.getChannel("channel");
        const action = interaction.options.getString("action");
        //typescript
        if (!channel) return
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild.id });

        if (!guildSettings) {
            const guildSettings = new client.guildSettings({
                guildId: interaction.guild.id,
                onlyimageChannels: [channel]
            });
            await guildSettings.save();
            interaction.reply(`Set ${channel} to an only image channel.`);
        } else {
            if (action === "add") {
                if (!guildSettings.onlyimageChannels) guildSettings.onlyimageChannels = [];
                guildSettings.onlyimageChannels.push(channel.id);
            } else if (action === "remove") {
                guildSettings.onlyimageChannels = guildSettings.onlyimageChannels.filter(c => c = channel.id);
            }
            guildSettings.save();
            interaction.reply(`Successfully ${action == "add" ? "set" : "removed"} ${channel} as an only image channel.`);
        }
    }
} as SlashCommand;