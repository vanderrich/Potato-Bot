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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const builders_1 = require("@discordjs/builders");
const config_json_1 = __importDefault(require("../../config.json"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("tag")
        .setDescription("Send a tag")
        .addStringOption(option => option
        .setName("tag")
        .setDescription("The tag to send")
        .setAutocomplete(true)
        .setRequired(true))
        .addUserOption(option => option
        .setName("target")
        .setDescription("user to ping")),
    category: "Info",
    execute(interaction, client) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const tag = interaction.options.getString("tag");
            if (!tag)
                return interaction.reply("You need to specify a tag");
            const tagTyped = tag;
            const target = interaction.options.getUser("target");
            const tagToSend = config_json_1.default.tagDescriptions[tagTyped] || ((_a = (yield client.guildSettings.findOne({ guildId: interaction.guildId }))) === null || _a === void 0 ? void 0 : _a.tagDescriptions[tagTyped]);
            if (!tagToSend)
                return interaction.reply("Tag not found");
            if (target) {
                interaction.reply(`*Tag suggestion for ${target}*\n\n${tagToSend}`);
            }
            else {
                interaction.reply(tagToSend);
            }
        });
    }
};
