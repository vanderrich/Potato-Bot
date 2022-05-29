import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("suicide")
        .setDescription("suicide"),
    category: "Fun",
    execute(interaction: CommandInteraction) {
        interaction.reply("please go to http://www.suicide.org/ :)");
    }
}