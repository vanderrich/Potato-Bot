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
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("work")
        .setDescription("Work to earn money!"),
    category: "Currency",
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let result = yield client.eco.work({
                user: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
                maxAmount: 100,
                replies: ['Potato Peeler', 'Janitor', 'Rice Cooker', 'Baker', 'Carpenter', 'Lumberjack', 'Miner', 'Farmer'],
                cooldown: 25
            });
            if (result.error)
                return interaction.reply(`You're too tired, Try again in ${result.time}`);
            else
                interaction.reply(`You worked as a ${result.workType} and earned **$${result.amount}**.`);
        });
    }
};
