import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suicide")
        .setDescription("suicide, why is this in the fun category"),
    category: "Fun",
    execute(interaction: CommandInteraction) {
        interaction.reply("please go to [suicide.org](http://www.suicide.org/) :)");
    }
}