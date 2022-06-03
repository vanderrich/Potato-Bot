"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("say")
        .setDescription("Make the bot say something")
        .addStringOption(option => option
        .setName("text")
        .setDescription("The text you want the bot to say")
        .setRequired(true)),
    category: "Fun",
    execute(interaction) {
        var _a;
        let text = interaction.options.getString("text");
        if (!text)
            return interaction.reply("You need to enter a text to say!");
        if (text.length > 2000)
            return interaction.reply("Your text is too long!");
        if (text.includes("@everyone") || text.includes("@here") && !((_a = interaction.memberPermissions) === null || _a === void 0 ? void 0 : _a.has('MENTION_EVERYONE')))
            return interaction.reply("You dont have the permission ping everyone or here!");
        interaction.reply(text);
    }
};
