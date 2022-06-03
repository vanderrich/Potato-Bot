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
        .setName("createticket")
        .setDescription("Create a ticket.")
        .addStringOption(option => option
        .setName("name")
        .setDescription("The name of the ticket.")
        .setRequired(true))
        .addStringOption(option => option
        .setName("description")
        .setDescription("The description of the ticket.")
        .setRequired(true))
        .addChannelOption(option => option
        .setName("channel")
        .setDescription("The channel to send the ticket to.")
        .setRequired(true))
        .addChannelOption(option => option
        .setName("category")
        .setDescription("The category to put the opened tickets.")
        .setRequired(true))
        .addChannelOption(option => option
        .setName("closecategory")
        .setDescription("The category to put the closed tickets.")
        .setRequired(true)),
    permission: 'MANAGE_MESSAGES',
    category: "Moderation",
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            let title = interaction.options.getString("name");
            let description = interaction.options.getString("description");
            let channel = interaction.options.getChannel("channel");
            let category = interaction.options.getChannel("category");
            let closecategory = interaction.options.getChannel("closecategory");
            if (!title)
                return interaction.reply("Provide a name for the ticket!");
            if (!description)
                return interaction.reply("Provide a description for the ticket!");
            if ((category === null || category === void 0 ? void 0 : category.type) !== "GUILD_CATEGORY" || (closecategory === null || closecategory === void 0 ? void 0 : closecategory.type) !== "GUILD_CATEGORY" || !category || !closecategory) {
                return interaction.reply("The category must be a guild category.");
            }
            if (!interaction.guild)
                return interaction.reply("This command can only be used in a guild.");
            if (!channel || !(channel instanceof discord_js_1.GuildChannel) || !channel.isText())
                return interaction.reply("The channel must be a guild channel.");
            let embed = new discord_js_1.MessageEmbed()
                .setTitle(title)
                .setDescription(description)
                .setColor('RANDOM')
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            let buttons = new discord_js_1.MessageActionRow()
                .addComponents(new discord_js_1.MessageButton()
                .setEmoji("📩")
                .setCustomId(`ticket-${title}`)
                .setStyle("PRIMARY"), new discord_js_1.MessageButton()
                .setEmoji("⛔")
                .setCustomId(`delete-ticket-type-${title}`)
                .setStyle("DANGER"));
            category.permissionOverwrites.create(interaction.guild.id, {
                'VIEW_CHANNEL': false,
                'SEND_MESSAGES': false,
                'READ_MESSAGE_HISTORY': false,
                'ADD_REACTIONS': false
            });
            let message = yield channel.send({ embeds: [embed], components: [buttons] });
            let ticket = new client.tickets({
                title: title,
                description: description,
                categoryId: category.id,
                closeCategoryId: closecategory.id,
                guildId: interaction.guild.id,
                messageId: message.id,
            });
            ticket.save()
                .then(() => {
                interaction.reply({ content: `Ticket created successfully!`, ephemeral: true });
            }).catch((err) => {
                console.log(err);
                interaction.reply({ content: `There was an error while creating the ticket: ${err}`, ephemeral: true });
            });
        });
    }
};
