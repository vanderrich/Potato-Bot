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
module.exports = {
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("autopublish")
        .setDescription("Auto publish new posts")
        .addChannelOption(option => option
        .setName("channel")
        .setRequired(true)
        .setDescription("The channel to publish to")),
    permissions: ["MANAGE_GUILD"],
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            const channel = interaction.options.getChannel("channel");
            const guild = interaction.guild;
            if (!guild)
                return interaction.reply("You can't use this command in a DM!");
            const guildSettings = yield client.guildSettings.findOne({ guildId: guild.id });
            if ((channel === null || channel === void 0 ? void 0 : channel.type) !== 'GUILD_NEWS')
                return interaction.reply("That channel is not a guild news channel");
            console.log(guildSettings);
            console.log(channel);
            if (guildSettings) {
                if (!guildSettings.autoPublishChannel)
                    guildSettings.autoPublishChannel = [channel.id];
                else
                    guildSettings.autoPublishChannel.push(channel.id);
                yield guildSettings.save();
                interaction.reply(`Added ${channel} to the auto publish channels list`);
            }
            else {
                const guildSettings = new client.guildSettings({ guildId: guild.id, autoPublishChannel: [channel.id] });
                yield guildSettings.save();
                interaction.reply("Created new setting");
            }
        });
    }
};
