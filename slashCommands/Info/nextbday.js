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
    data: new builders_1.SlashCommandSubcommandBuilder()
        .setName("next")
        .setDescription("Get the next birthday."),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            const guild = interaction.guild;
            if (!guild)
                return interaction.reply("This command can only be used in a server.");
            const birthdayConfig = yield client.birthdayConfigs.findOne({ guildId: guild.id });
            if (!birthdayConfig)
                return interaction.reply("You don't have any birthday data!");
            client.birthdays.find({
                guildId: guild.id,
                birthday: {
                    $gte: new Date(),
                }
            }, function (err, nextBirthday) {
                if (err)
                    return interaction.reply("Something went wrong!");
                if (nextBirthday.length > 0) {
                    const birthdayEmbed = new discord_js_1.MessageEmbed()
                        .setColor('RANDOM')
                        .setTitle("Birthday")
                        .setDescription(`${(0, builders_1.userMention)(nextBirthday[0].userId)}'s birthday is next on ${(0, builders_1.time)(nextBirthday[0].birthday, 'D')}`)
                        .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] })
                        .setTimestamp();
                    interaction.reply({ embeds: [birthdayEmbed] });
                }
                else {
                    interaction.reply("There are no birthdays!");
                }
            });
        });
    }
};
