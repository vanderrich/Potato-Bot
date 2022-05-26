const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("autopublish")
        .setDescription("Auto publish new posts")
        .addChannelOption(option => option
            .setName("channel")
            .setRequired(true)
            .setDescription("The channel to publish to")
        ),
    permissions: ["MANAGE_GUILD"],
    async execute(interaction, client, Discord, footers) {
        const channel = interaction.options.getChannel("channel");
        const guild = interaction.guild;
        const guildSettings = await client.guildSettings.findOne({ guildId: guild.id });
        if (channel?.type !== 'GUILD_NEWS') return interaction.reply("That channel is not a guild news channel");
        console.log(guildSettings);
        console.log(channel);

        if (guildSettings) {
            if (!guildSettings.autoPublishChannel) guildSettings.autoPublishChannel = [channel.id];
            else guildSettings.autoPublishChannel.push(channel.id);
            await guildSettings.msave();
            interaction.reply(`Added ${channel} to the auto publish channels list`);
        } else {
            const guildSettings = new client.guildSettings({ guildId: guild.id, autoPublishChannel: [channel.id] });
            await guildSettings.save();
            interaction.reply("Created new setting");
        }
    }
}