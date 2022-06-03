"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("bulkdelete")
        .setDescription("Bulk delete messages")
        .addIntegerOption(option => option
        .setName("amount")
        .setDescription("The amount of messages to delete")
        .setRequired(true)),
    permissions: "MANAGE_MESSAGES",
    category: "Moderation",
    execute(interaction) {
        var _a, _b;
        let amount = interaction.options.getInteger("amount");
        if (!amount || isNaN(amount) || amount < 0)
            return interaction.reply("Please enter a valid amount to delete");
        if (((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.type) === "DM")
            return interaction.reply("You can't use this command in a DM!");
        (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.bulkDelete(amount).then(() => {
            interaction.reply("Messages deleted!");
        }).catch(err => {
            interaction.reply("Error deleting messages: " + err);
        });
    }
};
