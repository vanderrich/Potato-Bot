const { SlashCommandBuilder } = require("@discordjs/builders");
const gifs = [
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-flame-fire-gif-5621394",
    "https://tenor.com/view/do-it-what-are-you-waiting-for-determined-angry-gif-5247874",
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-gif-4531935",
    "https://tenor.com/view/monday-motivation-positive-bunny-gif-12327682",
    "https://tenor.com/view/keep-it-up-gif-21565880",
    "https://tenor.com/view/motivational-quotes-motivation-action-focus-gif-23349783",
    "https://tenor.com/view/motivational-toast-toast-motivation-gif-15373786",
    "https://tenor.com/view/penguin-motivation-you-can-do-it-dont-give-up-gif-16922392"
]

module.exports = {
    data: new SlashCommandBuilder()
        .setName("motivation")
        .setDescription("Get a random motivational gif!"),
    category: "Fun",
    async execute(interaction, client, Discord) {
        interaction.reply(gifs[Math.floor(Math.random() * gifs.length)]);
    }
}