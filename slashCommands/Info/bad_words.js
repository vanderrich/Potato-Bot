const { SlashCommandSubcommandBuilder } = require("@discordjs/builders")
const { badWordPresets } = require("../../config.json").settings

module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("badwords")
        .setDescription("bad words")
        .addStringOption(option => option
            .setName("preset")
            .setDescription("The preset to use.")
            .setRequired(true)
            .addChoice("Low (only racism and other stuff)", "low")
            .addChoice("Medium (curse words other than f and s words and other stuff, recommended)", "medium")
            .addChoice("High (most curse words, recommended)", "high")
            .addChoice("Highest (all curse words, not recommended)", "highest")
            .addChoice("Custom", "custom")
        )
        .addStringOption(option => option
            .setName("custom")
            .setDescription("The custom bad words to use, seperate with commas.")
            .setRequired(false)
        ),
    category: "Info",
    isSubcommand: true,
    async execute(interaction, client, Discord, footers) {
        const preset = interaction.options.getString("preset");
        const custom = interaction.options.getString("custom");

        if (preset === "custom") {
            if (!custom) {
                return interaction.message.reply("You must specify the custom bad words to use.");
            }

            const badWords = custom.split(",");

            if (badWords.length === 0) {
                return interaction.message.reply("You must specify at least one bad word.");
            }

            if (await client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWords } });
            }
            else {
                const newSettings = new client.guildSettings({
                    guildID: interaction.guild.id,
                    badWords: badWords,
                    welcomeMessage: "",
                    welcomeRole: ""
                });
                newSettings.save();
            }

            return interaction.reply({ content: `Set the custom bad words to ${badWords.join(", ")}`, ephemeral: true });
        }
        else {
            if (await client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWordPresets[preset] } });
            }
            else {
                const newSettings = new client.guildSettings({
                    guildID: interaction.guild.id,
                    badWords: badWordPresets[preset],
                    welcomeMessage: "",
                    welcomeRole: ""
                });
                newSettings.save();
            }

            return interaction.reply(`Set the bad words to ${preset}`);
        }
    }
}