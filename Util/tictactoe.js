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
const discord_js_1 = require("discord.js");
function checkWin(board) {
    // Check rows
    if (board[0].components[0].label === board[0].components[1].label && board[0].components[0].label === board[0].components[2].label && board[0].components[0].label !== '_')
        return true;
    if (board[1].components[0].label === board[1].components[1].label && board[1].components[0].label === board[1].components[2].label && board[1].components[0].label !== '_')
        return true;
    if (board[2].components[0].label === board[2].components[1].label && board[2].components[0].label === board[2].components[2].label && board[2].components[0].label !== '_')
        return true;
    // Check columns
    if (board[0].components[0].label === board[1].components[0].label && board[0].components[0].label === board[2].components[0].label && board[0].components[0].label !== '_')
        return true;
    if (board[0].components[1].label === board[1].components[1].label && board[0].components[1].label === board[2].components[1].label && board[0].components[1].label !== '_')
        return true;
    if (board[0].components[2].label === board[1].components[2].label && board[0].components[2].label === board[2].components[2].label && board[0].components[2].label !== '_')
        return true;
    // Check diagonals
    if (board[0].components[0].label === board[1].components[1].label && board[0].components[0].label === board[2].components[2].label && board[0].components[0].label !== '_')
        return true;
    if (board[0].components[2].label === board[1].components[1].label && board[0].components[2].label === board[2].components[0].label && board[0].components[2].label !== '_')
        return true;
    // Check for tie
    for (let actionRow of board) {
        for (let action of actionRow.components) {
            if (action.label === '_')
                return false;
        }
    }
    return "tie";
}
exports.default = (interaction, client) => __awaiter(void 0, void 0, void 0, function* () {
    /** @type {Discord.Message} message */
    const message = interaction.message;
    if (!client.tictactoe[message.id])
        return;
    let xs = 0, os = 0;
    if (!(message instanceof discord_js_1.Message))
        return;
    for (let actionRow of message.components) {
        for (let button of actionRow.components) {
            if (!(button instanceof discord_js_1.MessageButton))
                continue;
            if (button.label === 'X')
                xs++;
            else if (button.label === 'O')
                os++;
        }
    }
    const xs_turn = xs <= os;
    const i = parseInt(interaction.customId[3]), j = parseInt(interaction.customId[4]);
    let currPlayer = xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o;
    if (interaction.user.id !== currPlayer) {
        return interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
    }
    const buttonPressed = message.components[i - 1].components[j - 1];
    if (!(buttonPressed instanceof discord_js_1.MessageButton))
        return;
    if (buttonPressed.label !== '_')
        return interaction.reply({ content: "Someone already played there!", ephemeral: true });
    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";
    const styleToNumber = (style) => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;
    const components = [];
    for (let actionRow of message.components) {
        const componentComponents = [];
        for (let button of actionRow.components) {
            if (!(button instanceof discord_js_1.MessageButton) || !button.style)
                continue;
            componentComponents.push({ type: 2, label: button.label, style: styleToNumber(button.style), custom_id: button.customId });
        }
        components.push({ type: 1, components: componentComponents });
    }
    const board = [];
    for (let row of message.components) {
        const newActionRow = new discord_js_1.MessageActionRow();
        for (let button of row.components) {
            if (!(button instanceof discord_js_1.MessageButton))
                continue;
            newActionRow.addComponents(button);
        }
        board.push(newActionRow);
    }
    if (checkWin(board) == "tie") {
        yield message.edit({ content: "It's a tie!", components: components });
        delete client.tictactoe[message.id];
    }
    else if (checkWin(board)) {
        yield message.edit({ content: `Game over! <@${xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o}> wins!`, components: components });
        delete client.tictactoe[message.id];
    }
    else
        yield message.edit({ content: `<@${xs_turn ? client.tictactoe[message.id].o : client.tictactoe[message.id].x}>'s turn`, components: components });
    client.tictactoe[message.id].lastInteraction = Date.now();
    yield interaction.deferUpdate();
});
