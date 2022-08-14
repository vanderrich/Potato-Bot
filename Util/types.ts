import { PermissionResolvable, CommandInteraction, ButtonInteraction, SelectMenuInteraction, Client as DiscClient, Collection, ContextMenuInteraction } from 'discord.js';
import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder, SlashCommandSubcommandBuilder, ContextMenuCommandBuilder } from '@discordjs/builders';
import { Model, Schema, Document } from 'mongoose';
import { shop } from './config.json';
// import { Player } from 'discord-player';
import Economy from 'currency-system';
import { Music } from '../localization';

export type SlashCommand = {
    data: SlashCommandBuilder | SlashCommandSubcommandGroupBuilder | SlashCommandSubcommandBuilder;
    contextMenu?: ContextMenuCommandBuilder;
    category: string;
    guildOnly?: boolean;
    permissions?: PermissionResolvable | "BotAdmin";
    execute: (interaction: CommandInteraction, client: Client, footers: string[], locale?: Music) => void;
}

export type MessageComponent = {
    name: string;
    permissions?: PermissionResolvable | "BotAdmin";
    execute: (interaction: ButtonInteraction | SelectMenuInteraction, client: Client, footers: string[]) => void;
}

export interface GuildSettings extends Document {
    guildId: string,
    badWords: string[],
    autoPublishChannels: string[],
    welcomeMessage: string,
    welcomeChannel: string,
    welcomeRole: string,
    suggestionChannel: string,
    ghostPing: boolean,
    tags: { name: string, value: string }[],
    tagDescriptions: {
        [key: string]: string;
    },
    statChannels: {
        type: string & "members" | "all members" | "bots" | "boosts" | "role members",
        channel: string,
        role?: string
    }[],
}

export type AutoCompleteValue = {
    name: string;
    value: string | number;
}

export type Language = {
    user: string;
    language: string;
}

export type Playlist = {
    name: string;
    tracks: string[];
    creator: string;
    managers: string[];
    settings: {
        loop: number & 0 | 1 | 2;
        shuffle: boolean;
        volume: number;
    }
}

export type Giveaway = {
    messageId: string,
    channelId: string,
    guildId: string,
    startAt: number,
    endAt: number,
    ended: boolean,
    winnerCount: number,
    prize: string,
    messages: {
        giveaway: string,
        giveawayEnded: string,
        inviteToParticipate: string,
        drawing: string,
        dropMessage: string,
        winMessage: Schema.Types.Mixed,
        embedFooter: Schema.Types.Mixed,
        noWinner: string,
        winners: string,
        endedAt: string,
        hostedBy: string
    },
    thumbnail: string,
    hostedBy: string,
    winnerIds?: string[],
    reaction: Schema.Types.Mixed,
    botsCanWin: boolean,
    embedColor: Schema.Types.Mixed,
    embedColorEnd: Schema.Types.Mixed,
    exemptPermissions?: any[],
    exemptMembers: string,
    bonusEntries: string,
    extraData: Schema.Types.Mixed,
    lastChance: {
        enabled: boolean,
        content: string,
        threshold: number,
        embedColor: Schema.Types.Mixed,
    },
    pauseOptions: {
        isPaused: boolean,
        content: string,
        unPauseAfter: number,
        embedColor: Schema.Types.Mixed,
        durationAfterPause: number,
        infiniteDurationText: string
    },
    isDrop: boolean,
    allowedMentions: {
        parse?: string[],
        users?: string[],
        roles?: string[],
    }
}

export type Ticket = {
    guildId: string,
    categoryId: string,
    closeCategoryId: string,
    channelId: string[],
    messageId: string,
    title: string,
    description: string,
}

export type Birthday = {
    userId: string,
    guildId: string,
    birthday: Date,
    haveCelebratedYears: [number]
}

export type BirthdayConfig = {
    guildId: string,
    channelId: string,
    roleId: string,
    message: string
}
export interface Client extends DiscClient {
    cachedTags: Collection<string, AutoCompleteValue[]>;
    cachedShopItems: Collection<string, AutoCompleteValue[]>;
    cachedInventories: Collection<string, AutoCompleteValue[]>;
    globalShopItems: any[];
    eco: typeof Economy;
    languages: Model<Language>;
    playlists: Model<Playlist>;
    tickets: Model<Ticket>;
    birthdays: Model<Birthday>;
    birthdayConfigs: Model<BirthdayConfig>;
    guildSettings: Model<GuildSettings>;
    giveawaysManager: any;
    shop: typeof shop;
    slashCommands: Collection<string, SlashCommand>;
    buttons: Collection<string, MessageComponent>;
    selectMenus: Collection<string, MessageComponent>;
    // player: Player;
    tictactoe: any;
    getLocale(interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction | ContextMenuInteraction, key: string, ...args: any[]): any;
    updateCache(): void;
}