import { ButtonInteraction } from "discord.js";
import updateGrid from '../../Util/tictactoe'

module.exports = {
    name: "ttt",
    execute: (interaction: ButtonInteraction, client: any) => {
        updateGrid(interaction, client)
    }
}