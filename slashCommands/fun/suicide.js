"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("suicide")
        .setDescription("suicide, why is this in the fun category"),
    category: "Fun",
    execute(interaction) {
        interaction.reply("please go to [suicide.org](http://www.suicide.org/) :)");
    }
};
