import { Message, MessageActionRow, MessageButton, ButtonInteraction } from "discord.js";
import { Tictactoe } from "../localization";
import { Client } from "./types";

function checkWin(board: MessageActionRow<MessageButton>[]) {
    // Check rows
    if (board[0].components[0].label === board[0].components[1].label && board[0].components[0].label === board[0].components[2].label && board[0].components[0].label !== '_') return true;
    if (board[1].components[0].label === board[1].components[1].label && board[1].components[0].label === board[1].components[2].label && board[1].components[0].label !== '_') return true;
    if (board[2].components[0].label === board[2].components[1].label && board[2].components[0].label === board[2].components[2].label && board[2].components[0].label !== '_') return true;
    // Check columns
    if (board[0].components[0].label === board[1].components[0].label && board[0].components[0].label === board[2].components[0].label && board[0].components[0].label !== '_') return true;
    if (board[0].components[1].label === board[1].components[1].label && board[0].components[1].label === board[2].components[1].label && board[0].components[1].label !== '_') return true;
    if (board[0].components[2].label === board[1].components[2].label && board[0].components[2].label === board[2].components[2].label && board[0].components[2].label !== '_') return true;
    // Check diagonals
    if (board[0].components[0].label === board[1].components[1].label && board[0].components[0].label === board[2].components[2].label && board[0].components[0].label !== '_') return true;
    if (board[0].components[2].label === board[1].components[1].label && board[0].components[2].label === board[2].components[0].label && board[0].components[2].label !== '_') return true;
    // Check for tie
    for (const actionRow of board) {
        for (const action of actionRow.components) {
            if (action.label === '_') return false;
        }
    }
    return "tie";
}

function ai(board: MessageActionRow<MessageButton>[]) {
    for (const actionRow of board) {
        for (const action of actionRow.components) {
            if (action.label === 'X') return
        }
    }
}

export default async (interaction: ButtonInteraction, client: Client) => {
    /** @type {Discord.Message} message */
    let message = interaction.message;
    if (!client.tictactoe[message.id]) return;

    const locale = client.getLocale(interaction, "commands.fun.tictactoe") as Tictactoe;

    let xs = 0, os = 0;
    if (!(message instanceof Message)) message = await interaction.channel!.messages.fetch(message.id)

    for (const actionRow of message.components) {
        for (const button of actionRow.components) {
            if (!(button instanceof MessageButton)) continue;
            if (button.label === 'X') xs++;
            else if (button.label === 'O') os++;
        }
    }

    const xs_turn = xs <= os;
    const i = parseInt(interaction.customId[4]),
        j = parseInt(interaction.customId[5]);

    const currPlayer = xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o;
    if (interaction.user.id !== currPlayer) {
        return interaction.reply({ content: locale.notYourTurn, ephemeral: true });
    }

    const board: MessageActionRow<MessageButton>[] = []
    //typing stuff
    for (const row of message.components) {
        const newActionRow = new MessageActionRow<MessageButton>();
        for (const button of row.components) {
            if (!(button instanceof MessageButton)) continue;
            newActionRow.addComponents(button);
        }
        board.push(newActionRow);
    }

    if (currPlayer === "ai") ai(board);


    const buttonPressed = message.components[i - 1].components[j - 1];
    if (!(buttonPressed instanceof MessageButton)) return;

    if (buttonPressed.label !== '_')
        return interaction.reply({ content: locale.havePlayedThere, ephemeral: true });

    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    const styleToNumber = (style: string) => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;

    const components = [];

    for (const actionRow of message.components) {
        const componentComponents = []
        for (const button of actionRow.components) {
            if (!(button instanceof MessageButton) || !button.style) continue;
            componentComponents.push({ type: 2, label: button.label, style: styleToNumber(button.style), custom_id: button.customId });
        }
        components.push({ type: 1, components: componentComponents });
    }

    const boardNew: MessageActionRow<MessageButton>[] = [];

    for (const row of message.components) {
        const newActionRow = new MessageActionRow<MessageButton>();
        for (const button of row.components) {
            if (!(button instanceof MessageButton)) continue;
            newActionRow.addComponents(button);
        }
        boardNew.push(newActionRow);
    }


    if (checkWin(boardNew) == "tie") {
        await message.edit({ content: locale.tie, components: components });
        delete client.tictactoe[message.id];
    }
    else if (checkWin(boardNew)) {
        await message.edit({ content: client.getLocale(interaction, "commands.tictactoe.gameOver", xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o), components: components });
        delete client.tictactoe[message.id];
    }
    else await message.edit({ content: client.getLocale(interaction, "commands.tictactoe.turn", xs_turn ? client.tictactoe[message.id].o : client.tictactoe[message.id].x), components: components });

    client.tictactoe[message.id].lastInteraction = Date.now();
    await interaction.deferUpdate();
}