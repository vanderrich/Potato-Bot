import { ButtonInteraction } from "discord.js";
import updateGrid from '../../Util/tictactoe'
import { Client } from "../../Util/types";

module.exports = {
    name: "ttt",
    execute: (interaction: ButtonInteraction, client: Client) => {
        updateGrid(interaction, client)
    }
}