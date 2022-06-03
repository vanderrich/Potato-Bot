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
const discord_js_1 = require("discord.js");
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("slots")
        .setDescription("Spin the slots!"),
    category: "Fun",
    execute(interaction, client, footers) {
        const footer = footers[Math.floor(Math.random() * footers.length)];
        let messages = [];
        let win = true;
        //initializes the emojis and the embed
        const diamond = client.emojis.cache.get("981348563852329050");
        const emerald = client.emojis.cache.get("981348806450896936");
        const potat = client.emojis.cache.get("981348806450896936");
        const embed = new discord_js_1.MessageEmbed()
            .setTitle('Slots')
            .setDescription('⬛⬛⬛')
            .setFooter({ text: footer });
        //sends the embed message and reacts to it
        interaction.reply({ embeds: [embed], fetchReply: true }).then((msg) => {
            if (msg instanceof discord_js_1.Message) {
                var frameCount = Math.floor(Math.random() * 5) + 5;
                for (let i = 0; i < frameCount; i++) {
                    let slotdisplay = [];
                    for (let x = 0; x < 3; x++) {
                        switch (Math.floor(Math.random() * 3)) {
                            case 1:
                                slotdisplay[x] = diamond;
                                break;
                            case 2:
                                slotdisplay[x] = potat;
                                break;
                            default:
                                slotdisplay[x] = emerald;
                                break;
                        }
                    }
                    messages.unshift(new discord_js_1.MessageEmbed()
                        .setTitle('Slots')
                        .setDescription(slotdisplay.join('')));
                    //check if the player won
                    if ((slotdisplay[0].id === slotdisplay[1].id && slotdisplay[1].id === slotdisplay[2].id) && i === 0)
                        win = true;
                    else if (i === 0)
                        win = false;
                }
                //sends the frames
                for (let i = 0; i < messages.length; i++) {
                    msg.edit({
                        embeds: [messages[i].setFooter({ text: footer })]
                    });
                }
                //sends the result
                if (win) {
                    setTimeout(function () {
                        var _a;
                        return __awaiter(this, void 0, void 0, function* () {
                            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`${interaction.user} won 50 💸!`);
                            yield client.eco.addMoney({ user: interaction.user.id, amount: 50, whereToPutMoney: "wallet" });
                        });
                    }, messages.length * 1000);
                }
                else {
                    setTimeout(function () {
                        var _a;
                        return __awaiter(this, void 0, void 0, function* () {
                            (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send(`You lost, try again next time`);
                        });
                    }, messages.length * 1000);
                }
            }
        });
    }
};
