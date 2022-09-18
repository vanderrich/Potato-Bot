import { SlashCommandBuilder } from "@discordjs/builders";
import { SlashCommand } from "../../Util/types";
const gifs = [
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-flame-fire-gif-5621394",
    "https://tenor.com/view/do-it-what-are-you-waiting-for-determined-angry-gif-5247874",
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-gif-4531935",
    "https://tenor.com/view/monday-motivation-positive-bunny-gif-12327682",
    "https://tenor.com/view/keep-it-up-gif-21565880",
    "https://tenor.com/view/motivational-toast-toast-motivation-gif-15373786",
    "https://tenor.com/view/penguin-motivation-you-can-do-it-dont-give-up-gif-16922392",
    "https://tenor.com/view/snail-encouragement-you-can-do-it-you-got-this-gif-5674505",
    "https://tenor.com/view/motivational-squirrel-motivational-squirrel-go-you-can-do-it-dance-gif-15538524"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("motivation")
        .setDescription("Get a random motivational gif!"),
    category: "Fun",
    async execute(interaction) {
        interaction.reply(gifs[Math.floor(Math.random() * gifs.length)]);
    }
} as SlashCommand;