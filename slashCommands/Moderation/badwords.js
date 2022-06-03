"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const config_json_1 = require("../../config.json");
const { badWordPresets } = config_json_1.settings;
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("badwords")
        .setDescription("bad words")
        .addStringOption(option => option
        .setName("preset")
        .setDescription("The preset to use.")
        .setRequired(true)
        .addChoices({ name: "Low (only racism and other stuff, default)", value: "low" }, { name: "Medium (curse words other than f and s and other stuff, recommended)", value: "medium" }, { name: "High (most curse words, not recommended)", value: "high" }, { name: "Highest (all curse words)", value: "highest" }, { name: "Custom", value: "custom" }))
        .addStringOption(option => option
        .setName("custom")
        .setDescription("The custom bad words to use, seperate with commas.")
        .setRequired(false)),
    category: "Moderation",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const preset = interaction.options.getString("preset");
            const custom = interaction.options.getString("custom");
            if (!interaction.guild)
                return interaction.reply("You can't use this command in a DM!");
            if (preset === "custom" || !preset) {
                if (!custom) {
                    return interaction.reply("You must specify the custom bad words to use.");
                }
                const badWords = custom.split(",");
                if (badWords.length === 0) {
                    return interaction.reply("You must specify at least one bad word.");
                }
                if (yield client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                    console.log("found settings");
                    yield client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWords } });
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
                const badWordPresetTyped = preset;
                if (yield client.guildSettings.findOne({ guildID: interaction.guild.id })) {
                    yield client.guildSettings.updateOne({ guildID: interaction.guild.id }, { $set: { badWords: badWordPresets[badWordPresetTyped] } });
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
        });
    }
};
