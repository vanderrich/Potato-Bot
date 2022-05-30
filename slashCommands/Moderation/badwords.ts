import { SlashCommandSubcommandBuilder } from "@discordjs/builders"
import { CommandInteraction } from "discord.js";
import { settings } from "../../config.json"
const { badWordPresets } = settings;
type badWordsTypeThingy = string & "low" | "medium" | "high";
module.exports = {
    data: new SlashCommandSubcommandBuilder()
        .setName("badwords")
        .setDescription("bad words")
        .addStringOption(option => option
            .setName("preset")
            .setDescription("The preset to use.")
            .setRequired(true)
            .addChoices(
                { name: "Low (only racism and other stuff, default)", value: "low" },
                { name: "Medium (curse words other than f and s and other stuff, recommended)", value: "medium" },
                { name: "High (most curse words, not recommended)", value: "high" },
                { name: "Highest (all curse words)", value: "highest" },
                { name: "Custom", value: "custom" },
            )
        )
        .addStringOption(option => option
            .setName("custom")
            .setDescription("The custom bad words to use, seperate with commas.")
            .setRequired(false)
        ),
    category: "Moderation",
    isSubcommand: true,
    async execute(interaction: CommandInteraction, client: any) {
        const preset = interaction.options.getString("preset");
        const custom = interaction.options.getString("custom");

        if (!interaction.guild) return interaction.reply("You can't use this command in a DM!");

        if (preset === "custom" || !preset) {
            if (!custom) {
                return interaction.reply("You must specify the custom bad words to use.");
            }

            const badWords = custom.split(",");

            if (badWords.length === 0) {
                return interaction.reply("You must specify at least one bad word.");
            }

            if (await client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                console.log("found settings");
                await client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWords } });
            }
            else {
                const newSettings = new client.guildSettings({
                    guildID: interaction.guild.id,
                    badWords: badWords,
                    welcomeMessage: "",
                    welcomeChannel: "",
                    welcomeRole: ""
                });
                newSettings.save();
            }

            return interaction.reply({ content: `Set the custom bad words to ${badWords.join(", ")}`, ephemeral: true });
        }
        else {
            const badWordPresetTyped: badWordsTypeThingy = preset as badWordsTypeThingy;
            if (await client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                await client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWordPresets[badWordPresetTyped] } });
            }
            else {
                const newSettings = new client.guildSettings({
                    guildID: interaction.guild.id,
                    badWords: badWordPresets[badWordPresetTyped],
                    welcomeMessage: "",
                    welcomeChannel: "",
                    welcomeRole: ""
                });
                newSettings.save();
            }

            return interaction.reply(`Set the bad words to ${preset}`);
        }
    }
}