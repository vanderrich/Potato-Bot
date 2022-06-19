import { PermissionResolvable, CommandInteraction, ButtonInteraction, SelectMenuInteraction, Client as DiscClient, Collection } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Model } from 'mongoose';
import { shop } from './config.json';
import { Player } from 'discord-player';
import Economy from 'currency-system';

export type SlashCommand = {
    data: typeof SlashCommandBuilder;
    category: string;
    guildOnly?: boolean;
    permissions?: PermissionResolvable | "BotAdmin";
    execute: (interaction: CommandInteraction, client: Client, footers: string[]) => void;
}

export type MessageComponent = {
    name: string;
    permissions?: PermissionResolvable | "BotAdmin";
    execute: (interaction: ButtonInteraction | SelectMenuInteraction, client: Client, footers: string[]) => void;
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

export interface Client extends DiscClient {
    cachedTags: Collection<string, AutoCompleteValue[]>;
    cachedShopItems: Collection<string, AutoCompleteValue[]>;
    cachedInventories: Collection<string, AutoCompleteValue[]>;
    globalShopItems: any[];
    eco: typeof Economy;
    languages: typeof Model;
    playlists: typeof Model;
    rr: typeof Model;
    tickets: typeof Model;
    birthdays: typeof Model;
    birthdayConfigs: typeof Model;
    guildSettings: typeof Model;
    forms: typeof Model;
    giveawaysManager: any;
    shop: typeof shop;
    slashCommands: Collection<string, SlashCommand>;
    buttons: Collection<string, MessageComponent>;
    selectMenus: Collection<string, MessageComponent>;
    player: Player;
    tictactoe: any;
    getLocale(userId: string, key: string, ...args: any[]): any;
    updateCache(): void;
}