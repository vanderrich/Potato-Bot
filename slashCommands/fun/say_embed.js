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
        .setName("say_embed")
        .setDescription("Make the bot send an embed")
        .addStringOption(option => option
        .setName("title")
        .setDescription("The title of the embed")
        .setRequired(true))
        .addStringOption(option => option
        .setName("description")
        .setDescription("The description of the embed")),
    category: "Fun",
    execute(interaction, client, footers) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            const title = interaction.options.getString("title");
            let description = interaction.options.getString("description");
            if (!description) {
                yield interaction.deferReply();
                const message = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.send("Enter a description, wait for 30 seconds to leave it empty."));
                const descriptionThingy = yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.awaitMessages({ filter: (m) => m.author.id === interaction.user.id, max: 1, time: 30000 }));
                description = ((_c = descriptionThingy === null || descriptionThingy === void 0 ? void 0 : descriptionThingy.first()) === null || _c === void 0 ? void 0 : _c.content) || "";
                message === null || message === void 0 ? void 0 : message.delete();
                (_d = descriptionThingy === null || descriptionThingy === void 0 ? void 0 : descriptionThingy.first()) === null || _d === void 0 ? void 0 : _d.delete();
            }
            if (!title)
                return interaction.reply("Please specify a title!");
            const embed = new discord_js_1.MessageEmbed()
                .setColor('RANDOM')
                .setTitle(title)
                .setDescription(description)
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.editReply({ embeds: [embed] });
        });
    }
};
