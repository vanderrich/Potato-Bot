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
        .setName("suggest")
        .setDescription("Suggest to a channel")
        .addStringOption(option => option
        .setName("suggestion")
        .setDescription("The suggestion")
        .setRequired(true))
        .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the suggestion in")
        .setRequired(true)),
    category: "Info",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel("channel");
            const suggestion = interaction.options.getString("suggestion");
            if (!channel)
                return interaction.editReply("You need to specify a channel!");
            if (!suggestion)
                return interaction.editReply("You need to specify a suggestion!");
            if (channel.type !== "GUILD_TEXT")
                return interaction.editReply("That channel is not a text channel!");
            const embed = new discord_js_1.MessageEmbed()
                .setColor("#0099ff")
                .setTitle("Suggestion")
                .setDescription(suggestion)
                .setTimestamp()
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                .setThumbnail(client.user.displayAvatarURL({ format: "png" }));
            yield channel.send({ embeds: [embed] });
            interaction.editReply("Your suggestion has been sent!");
        });
    }
};
