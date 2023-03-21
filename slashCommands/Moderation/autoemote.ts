import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autoemote")
        .setDescription("Automatically reacts when a message is sent on a certain channel")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("channel")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("emoji")
                .setDescription("The emoji to react")
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
        const emoji = interaction.options.getString("emoji");
        //typescript
        if (!channel || !emoji) return
        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");
        const guildSettings = await client.guildSettings.findOne({ guildId: interaction.guild.id });

        //check if emoji is emoji
        if (!client.emojis.cache.get(emoji.replace(/<:[a-z]+:/g, "").replace(/>/g, "")) && !emoji.match(/(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/)) return interaction.reply(client.getLocale(interaction, "commands.moderation.reactroles.invalidEmoji", emoji));

        if (!guildSettings) {
            const guildSettings = new client.guildSettings({
                guildId: interaction.guild.id,
                autoemoteChannels: [channel]
            });
            await guildSettings.save();
            interaction.reply(`Set ${channel} to always react with the emoji ${emoji}.`);
        } else {
            if (action === "add") {
                if (!guildSettings.autoemoteChannels) guildSettings.autoemoteChannels = [];
                guildSettings.autoemoteChannels.push({ channel: channel.id, emoji });
            } else if (action === "remove") {
                guildSettings.autoemoteChannels = guildSettings.autoemoteChannels.filter(c => c.channel = channel.id);
            }
            guildSettings.save();
            interaction.reply(`Successfully ${action == "add" ? "set" : "removed"} ${channel} to always react with the emoji ${emoji}.`);
        }
    }
} as SlashCommand;