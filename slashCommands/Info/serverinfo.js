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
const filterLevels = {
    DISABLED: 'Off',
    MEMBERS_WITHOUT_ROLES: 'No Role',
    ALL_MEMBERS: 'Everyone'
};
const verificationLevels = {
    NONE: 'None',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: '(╯°□°）╯︵ ┻━┻',
    VERY_HIGH: '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
};
module.exports = {
    data: new builders_1.SlashCommandBuilder()
        .setName('serverinfo')
        .setDescription('Information about the server'),
    category: 'Info',
    execute(interaction, client, footers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild)
                return interaction.reply('This command can only be used in a server.');
            //variables
            const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
            const members = interaction.guild.members.cache;
            const channels = interaction.guild.channels.cache;
            const emojis = interaction.guild.emojis.cache;
            //embed
            const embed = new discord_js_1.MessageEmbed()
                .setDescription(`**Server Info**`)
                .setColor('RANDOM')
                .addField('General', `
                **Name:** ${interaction.guild.name}
                **ID:** ${interaction.guild.id}
                **Boost Tier:** ${interaction.guild.premiumTier == 'NONE' ? `Tier ${interaction.guild.premiumTier}` : 'None'}
                **Explicit Filter:** ${filterLevels[interaction.guild.explicitContentFilter]}
                **Verification Level:** ${verificationLevels[interaction.guild.verificationLevel]}
                \n\u200b
            `)
                .addField('Statistics', `
                **Role Count:** ${roles.length}
                **Emoji Count:** ${emojis.size}
                **Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}
                **Animated Emoji Count:** ${emojis.filter(emoji => !(!emoji.animated)).size}
                **Member Count:** ${interaction.guild.memberCount}
                **Bots:** ${members.filter(member => member.user.bot).size}
                **Text Channels:** ${channels.filter(channel => channel.isText()).size}
                ** Voice Channels:** ${channels.filter(channel => channel.isVoice()).size}
                **Boost Count:** ${interaction.guild.premiumSubscriptionCount || '0'}
                \u200b
            `)
                .addField('Presence', `
                **Online:** ${members.filter(member => { var _a; return ((_a = member.presence) === null || _a === void 0 ? void 0 : _a.status) == 'online'; }).size}
                **Idle:** ${members.filter(member => { var _a; return ((_a = member.presence) === null || _a === void 0 ? void 0 : _a.status) == 'idle'; }).size}
                **Do Not Disturb:** ${members.filter(member => { var _a; return ((_a = member.presence) === null || _a === void 0 ? void 0 : _a.status) == 'dnd'; }).size}
                **Offline:** ${members.filter(member => member.presence == null).size}
                \u200b
            `)
                .addField(`Roles [${roles.length - 1}]`, roles.join(', '))
                .setFooter({ text: footers[Math.floor(Math.random() * footers.length)] });
            interaction.reply({ embeds: [embed] });
        });
    }
};
