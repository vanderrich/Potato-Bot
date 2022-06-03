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
        .setName("set")
        .setDescription("Set your birthday.")
        .addStringOption(option => option
        .setName("birthdate")
        .setDescription("Your birthdate in MM/DD, eg. 01/01")
        .setRequired(true)),
    category: "Info",
    isSubcommand: true,
    execute(interaction, client) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            const birthdate = interaction.options.getString("birthdate");
            const user = interaction.user;
            if (!birthdate)
                return interaction.editReply("You need to specify your birthdate and timezone!");
            let birthdateArray = birthdate.split("/");
            if (birthdateArray.length != 2)
                return interaction.editReply("Invalid birthdate!");
            if (birthdateArray[0].length != 2 || birthdateArray[1].length != 2)
                return interaction.editReply("Invalid birthdate!");
            let month = parseInt(birthdateArray[0]);
            let day = parseInt(birthdateArray[1]);
            if (month < 1 || month > 12)
                return interaction.editReply("Invalid birthdate!");
            if (day < 1 || day > 31)
                return interaction.editReply("Invalid birthdate!");
            let now = new Date(), date = new Date(now.getFullYear(), month - 1, day);
            if (date > now)
                date.setFullYear(date.getFullYear() - 1);
            if (client.birthdays.findOne({ userId: user.id })) {
                client.birthdays.updateOne({ userId: user.id }, {
                    $set: {
                        birthday: date,
                    }
                })
                    .then(() => {
                    return interaction.editReply("Your birthday has been updated!");
                })
                    .catch((err) => {
                    interaction.editReply("Something went wrong! Error: " + err);
                    return console.log(err);
                });
            }
            else {
                const birthday = new client.birthdays({
                    userId: user.id,
                    guildId: interaction.guild ? interaction.guild.id : undefined,
                    birthday: date,
                });
                birthday.save().then(() => {
                    interaction.editReply("Birthday set!");
                    console.log(`[INFO] ${user.tag} set their birthday to ${birthdate}`);
                })
                    .catch((err) => {
                    console.error(err);
                    interaction.editReply("Something went wrong! Error: " + err);
                });
            }
        });
    }
};
