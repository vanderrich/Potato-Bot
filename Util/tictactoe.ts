import { Message, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
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
    for (let actionRow of board) {
        for (let action of actionRow.components) {
            if (action.label === '_') return false;
        }
    }
    return "tie";
}

export default async (interaction: MessageComponentInteraction, client: Client) => {
    /** @type {Discord.Message} message */
    let message = interaction.message;
    if (!client.tictactoe[message.id]) return;

    let xs = 0, os = 0;
    if (!(message instanceof Message)) message = await interaction.channel!.messages.fetch(message.id)

    for (let actionRow of message.components) {
        for (let button of actionRow.components) {
            if (!(button instanceof MessageButton)) continue;
            if (button.label === 'X') xs++;
            else if (button.label === 'O') os++;
        }
    }

    const xs_turn = xs <= os;
    const i = parseInt(interaction.customId[3]),
        j = parseInt(interaction.customId[4]);

    let currPlayer = xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o;
    if (interaction.user.id !== currPlayer) {
        return interaction.reply({ content: 'It\'s not your turn!', ephemeral: true });
    }

    const buttonPressed = message.components[i - 1].components[j - 1];
    if (!(buttonPressed instanceof MessageButton)) return;

    if (buttonPressed.label !== '_')
        return interaction.reply({ content: "Someone already played there!", ephemeral: true });

    buttonPressed.label = xs_turn ? 'X' : 'O';
    buttonPressed.style = xs_turn ? "SUCCESS" : "DANGER";

    const styleToNumber = (style: string) => style === "SECONDARY" ? 2 : style === "SUCCESS" ? 3 : 4;

    const components = [];

    for (let actionRow of message.components) {
        const componentComponents = []
        for (let button of actionRow.components) {
            if (!(button instanceof MessageButton) || !button.style) continue;
            componentComponents.push({ type: 2, label: button.label, style: styleToNumber(button.style), custom_id: button.customId });
        }
        components.push({ type: 1, components: componentComponents });
    }

    const board: MessageActionRow<MessageButton>[] = [];

    for (let row of message.components) {
        const newActionRow = new MessageActionRow<MessageButton>();
        for (let button of row.components) {
            if (!(button instanceof MessageButton)) continue;
            newActionRow.addComponents(button);
        }
        board.push(newActionRow);
    }


    if (checkWin(board) == "tie") {
        await message.edit({ content: "It's a tie!", components: components });
        delete client.tictactoe[message.id];
    }
    else if (checkWin(board)) {
        await message.edit({ content: `Game over! <@${xs_turn ? client.tictactoe[message.id].x : client.tictactoe[message.id].o}> wins!`, components: components });
        delete client.tictactoe[message.id];
    }
    else await message.edit({ content: `<@${xs_turn ? client.tictactoe[message.id].o : client.tictactoe[message.id].x}>'s turn`, components: components });

    client.tictactoe[message.id].lastInteraction = Date.now();
    await interaction.deferUpdate();
}