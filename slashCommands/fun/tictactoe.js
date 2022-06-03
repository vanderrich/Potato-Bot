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
const v9_1 = require("discord-api-types/v9");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("tictactoe")
        .setDescription("Play tictactoe")
        .addUserOption(option => option
        .setName("opponent")
        .setDescription("The opponent to play against")
        .setRequired(true)),
    contextMenu: new builders_1.ContextMenuCommandBuilder()
        .setName("tictactoe")
        .setType(v9_1.ApplicationCommandType.User),
    category: "Fun",
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const opponent = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
            if (interaction.user.id == opponent)
                return interaction.reply({ content: "You can't play against yourself!", ephemeral: true });
            if (opponent == client.user.id)
                return interaction.reply({ content: "You can't play against me!", ephemeral: true });
            if (opponent.bot)
                (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send('Have fun playing with a bot lol');
            const game = yield interaction.reply({
                content: `${interaction.user}'s turn`,
                components: [
                    {
                        type: 1, components: [
                            { type: 2, label: "_", style: 2, custom_id: "ttt11" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt12" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt13" },
                        ]
                    },
                    {
                        type: 1, components: [
                            { type: 2, label: "_", style: 2, custom_id: "ttt21" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt22" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt23" },
                        ]
                    },
                    {
                        type: 1, components: [
                            { type: 2, label: "_", style: 2, custom_id: "ttt31" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt32" },
                            { type: 2, label: "_", style: 2, custom_id: "ttt33" },
                        ]
                    },
                ],
                fetchReply: true,
            });
            client.tictactoe[game.id] = {
                x: interaction.user.id,
                o: opponent.id,
                message: game
            };
            setTimeout(() => {
                if (client.tictactoe[game.id]) {
                    delete client.tictactoe[game.id];
                }
            }, 300000);
        });
    }
};
