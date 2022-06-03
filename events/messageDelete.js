"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importDefault(require("discord.js"));
module.exports = {
    name: 'messageDelete',
    execute(message, client) {
        var _a, _b;
        //ghost ping detection
        if (((_a = message.mentions) === null || _a === void 0 ? void 0 : _a.users.size) > 0 || ((_b = message.mentions) === null || _b === void 0 ? void 0 : _b.roles.size) > 0 || (message === null || message === void 0 ? void 0 : message.mentions.everyone)) {
            if (message.author.bot)
                return;
            let user = message.mentions.users;
            let roles = message.mentions.roles;
            let everyone = message.mentions.everyone;
            let embed = new discord_js_1.default.MessageEmbed()
                .setColor("RANDOM")
                .setTitle("Ghost ping detected!")
                .addField("Sender", message.author.toString())
                .addField("Pinged user(s)", `${user.map(u => u.toString()).join(", ")}, ${roles.map(r => r.toString()).join(", ")}, ${everyone ? " @everyone" : ""}`)
                .addField("Message", message.content);
            message.channel.send({ embeds: [embed] });
        }
    }
};
