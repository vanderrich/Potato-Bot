"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const ms_1 = __importDefault(require("ms"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("creategiveaway")
        .setDescription("Create a new giveaway")
        .addStringOption(option => option
        .setName("duration")
        .setDescription("The duration of the giveaway (in milliseconds)")
        .setRequired(true))
        .addIntegerOption(option => option
        .setName("winners")
        .setDescription("The amount of winners")
        .setRequired(true))
        .addStringOption(option => option
        .setName("prize")
        .setDescription("The prize of the giveaway")
        .setRequired(true)),
    permissions: "ADMINISTRATOR",
    category: "Moderation",
    execute(interaction, client) {
        let duration = interaction.options.getString("duration");
        let winners = interaction.options.getInteger("winners");
        let prize = interaction.options.getString("prize");
        client.giveawaysManager.start(interaction.channel, {
            duration: (0, ms_1.default)(duration),
            winnerCount: winners,
            prize: prize,
            hostedBy: interaction.user.tag
        }).then((gData) => {
            interaction.reply({ content: `Giveaway created!\n\n${gData.toString()}`, ephemeral: true });
        });
    }
};
