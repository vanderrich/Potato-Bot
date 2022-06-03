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
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("clear")
        .setDescription("Clear the queue."),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
            if (!queue || !queue.playing)
                return interaction.reply(`${interaction.user}, No music currently playing. ❌`);
            if (!queue.tracks[0])
                return interaction.reply(`${interaction.user}, There is already no music in queue after the current one ❌`);
            yield queue.clear();
            interaction.reply(`The queue has just been cleared. 🗑️`);
        });
    },
};
