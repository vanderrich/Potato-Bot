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
        .setName("filter")
        .setDescription("Add a filter to the music playing")
        .addStringOption(option => option
        .setName("filter")
        .setDescription("Filter")
        .setRequired(true)
        .addChoices({ name: "8D", value: "8D" }, { name: "nightcore", value: "nightcore" }, { name: "bassbost", value: "bassbost" })),
    category: "Music",
    isSubcommand: true,
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const queue = client.player.getQueue((_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id);
            if (!queue || !queue.playing)
                return interaction.reply(`${interaction.user}, There is no music currently playing!. ❌`);
            const actualFilter = queue.getFiltersEnabled()[0];
            const filters = [];
            queue.getFiltersEnabled().map((x) => filters.push(x));
            queue.getFiltersDisabled().map((x) => filters.push(x));
            const filter = filters.find((x) => { var _a; return x.toLowerCase() === ((_a = interaction.options.getString("filter")) === null || _a === void 0 ? void 0 : _a.toLowerCase()); });
            if (!filter)
                return interaction.reply(`${interaction.user}, I couldn't find a filter with your name. ❌\n\`bassboost, 8D, nightcore\``);
            const filtersUpdated = {};
            filtersUpdated[filter] = queue.getFiltersEnabled().includes(filter) ? false : true;
            yield queue.setFilters(filtersUpdated);
            interaction.reply(`Applied: **${filter}**, Filter Status: **${queue.getFiltersEnabled().includes(filter) ? 'Active' : 'Inactive'}** ✅\n **Remember, if the music is long, the filter application time may be longer accordingly.**`);
        });
    },
};
