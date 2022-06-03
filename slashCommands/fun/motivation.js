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
const gifs = [
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-flame-fire-gif-5621394",
    "https://tenor.com/view/do-it-what-are-you-waiting-for-determined-angry-gif-5247874",
    "https://tenor.com/view/just-do-it-shia-la-beouf-do-it-gif-4531935",
    "https://tenor.com/view/monday-motivation-positive-bunny-gif-12327682",
    "https://tenor.com/view/keep-it-up-gif-21565880",
    "https://tenor.com/view/motivational-toast-toast-motivation-gif-15373786",
    "https://tenor.com/view/penguin-motivation-you-can-do-it-dont-give-up-gif-16922392"
];
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("motivation")
        .setDescription("Get a random motivational gif!"),
    category: "Fun",
    execute(interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            interaction.reply(gifs[Math.floor(Math.random() * gifs.length)]);
        });
    }
};
