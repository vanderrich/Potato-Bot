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
        .setName("tags")
        .setDescription("Tags")
        .addStringOption(option => option
        .setName("action")
        .setDescription("The action to perform")
        .addChoices({ name: "add", value: "add" }, { name: "remove", value: "remove" })
        .setRequired(true))
        .addStringOption(option => option
        .setName("tag")
        .setDescription("The tag to add")
        .setRequired(true))
        .addStringOption(option => option
        .setName("customid")
        .setDescription("The value of the tag in the options")
        .setRequired(true))
        .addStringOption(option => option
        .setName("value")
        .setDescription("The value of the tag to send")),
    category: "Moderation",
    permission: "MANAGE_GUILD",
    isSubcommand: true,
    execute(interaction, client, footers) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const tag = interaction.options.getString("tag");
            const customid = (_a = interaction.options.getString("customid")) === null || _a === void 0 ? void 0 : _a.toLowerCase().replace(/ /g, "");
            const value = interaction.options.getString("value");
            const action = interaction.options.getString("action");
            if (!tag || !customid || (!value && action == "add"))
                return interaction.reply("You must provide a tag, customid, and value.");
            if (!interaction.guild)
                return interaction.reply("You can't use this command in a DM!");
            const guildSettings = yield client.guildSettings.findOne({ guildId: interaction.guild.id });
            if (!guildSettings) {
                const guildSettings = new client.guildSettings({
                    guildId: interaction.guild.id,
                    tags: [{
                            name: tag,
                            value: customid
                        }],
                    tagDescriptions: {
                        [customid]: value
                    }
                });
                yield guildSettings.save();
                interaction.reply(`Created setting with the tag ${tag} with customid ${customid} and value ${value}`);
            }
            else {
                if (action === "add") {
                    if (!guildSettings.tags)
                        guildSettings.tags = [];
                    if (!guildSettings.tagDescriptions)
                        guildSettings.tagDescriptions = {};
                    guildSettings.tags.push({ name: tag, value: customid });
                    guildSettings.tagDescriptions = { [customid]: value };
                }
                else if (action === "remove") {
                    guildSettings.tags = guildSettings.tags.filter((t) => t.name !== tag && t.value !== customid);
                    delete guildSettings.tagDescriptions[customid];
                }
                guildSettings.save();
                interaction.reply(`Successfully ${action == "add" ? "added" : "removed"} the tag **${tag}** with the custom id **${customid}** ${action == "add" ? `and value **${value}**` : ''} `);
            }
        });
    }
};
