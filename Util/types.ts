import Discord from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import * as mongoose from 'mongoose';
import { shop } from './config.json';
import { Player } from 'discord-player';
import Economy from 'currency-system';

export type SlashCommand = {
    data: SlashCommandBuilder;
    category: string;
    guildOnly?: boolean;
    permissions?: Discord.PermissionResolvable | "BotAdmin";
    execute: (interaction: Discord.CommandInteraction, client: Client, footers: string[]) => void;
}

export type MessageComponent = {
    name: string;
    permissions?: Discord.PermissionResolvable | "BotAdmin";
    execute: (interaction: Discord.ButtonInteraction | Discord.SelectMenuInteraction, client: Client, footers: string[]) => void;
}

export type GuildSettings = {
    guildId: string,
    badWords: string[],
    autoPublishChannels: string[],
    welcomeMessage: string,
    welcomeChannel: string,
    welcomeRole: string,
    suggestionChannel: string,
    ghostPing: boolean,
    tags: { name: string, value: string }[],
    tagDescriptions: Object,
    statChannels: string[],
}

export type AutoCompleteValue = {
    name: string;
    value: string | number;
}

export interface Client extends Discord.Client {
    cachedTags: Discord.Collection<string, AutoCompleteValue[]>;
    cachedShopItems: Discord.Collection<string, AutoCompleteValue[]>;
    cachedInventories: Discord.Collection<string, AutoCompleteValue[]>;
    globalShopItems: any[];
    eco: typeof Economy;
    languages: mongoose.Model<any>;
    playlists: mongoose.Model<any>;
    rr: mongoose.Model<any>;
    tickets: mongoose.Model<any>;
    birthdays: mongoose.Model<any>;
    birthdayConfigs: mongoose.Model<any>;
    guildSettings: mongoose.Model<any>;
    forms: mongoose.Model<any>;
    giveawaysManager: any;
    shop: typeof shop;
    slashCommands: Discord.Collection<string, SlashCommand>;
    buttons: Discord.Collection<string, MessageComponent>;
    selectMenus: Discord.Collection<string, MessageComponent>;
    player: Player;
    tictactoe: any;
    getLocale(userId: string, key: string, ...args: any[]): any;
    updateCache(): void;
}