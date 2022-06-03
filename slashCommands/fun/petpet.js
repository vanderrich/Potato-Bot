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
const discord_js_1 = require("discord.js");
const v9_1 = require("discord-api-types/v9");
const pet_pet_gif_1 = __importDefault(require("pet-pet-gif"));
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName("petpet")
        .setDescription("sends a gif of a hand patting someone")
        .addUserOption(option => option
        .setName("user")
        .setRequired(false)
        .setDescription("the user to pet, defaults to yourself")),
    contextMenu: new builders_1.ContextMenuCommandBuilder()
        .setName("petpet")
        .setType(v9_1.ApplicationCommandType.User),
    category: "Fun",
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = interaction.isContextMenu() ? client.users.cache.get(interaction.targetId) : (interaction.options.getUser("user") || interaction.user);
            const avatar = user.displayAvatarURL({ format: "png", size: 512 });
            const animatedGif = yield (0, pet_pet_gif_1.default)(avatar);
            interaction.reply({ files: [new discord_js_1.MessageAttachment(animatedGif, "petpet.gif")] });
        });
    }
};
