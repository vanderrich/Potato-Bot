"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("typingindicator")
        .setDescription("Make the bot send a typing indicator"),
    category: "Fun",
    execute(interaction) {
        var _a;
        interaction.reply({ content: "Typing...", ephemeral: true });
        (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.sendTyping();
    }
};
