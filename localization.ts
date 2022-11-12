export interface RootObject {
    haventTrasnlate: string;
    en: En;
    id: Id;
    nl: Nl;
    tl: Nl;
}

export interface Nl {
    name: string;
    native: string;
    locale: string;
    commands: Commands3;
    utils: Utils;
}

export interface Commands3 {
    currency: Currency;
    fun: Fun;
    info: Info2;
    moderation: Moderation3;
    music: Music;
}

export interface Moderation3 {
    modActions: ModActions;
    createGiveaway: CreateGiveaway;
    settings: Settings;
    reactroles: Reactroles2;
    createticket: Createticket;
}

export interface Info2 {
    help: Help2;
    links: Links2;
    ping: Ping;
    poll: Poll;
    userInfo: UserInfo;
    serverInfo: ServerInfo;
    suggest: Suggest;
    birthday: BirthdayLocaleType;
    tag: Tag;
    language: Language;
    dictionary: Dictionary;
}

export interface Links2 {
    embedTitle: string;
    github: string;
    discServer: string;
    invite: string;
    trello: string;
}

export interface Help2 {
    asciify: Asciify;
    categories: string[];
    noCategory: string;
    noCommand: string;
    embedTitle: string;
    embedDesc: string;
    commandsInCategory: string;
}

export interface Id {
    name: string;
    native: string;
    locale: string;
    commands: Commands2;
    utils: Utils;
}

export interface Commands2 {
    currency: Currency2;
    fun: Fun;
    info: Info;
    moderation: Moderation2;
    music: Music;
}

export interface Moderation2 {
    asciify: Asciify;
    modActions: ModActions;
    createGiveaway: CreateGiveaway;
    settings: Settings;
    reactroles: Reactroles2;
    createticket: Createticket;
}

export interface Reactroles2 {
    noTextChannel: string;
    noPerms: string;
    invalidEmoji: string;
    roleTooHigh: string;
    success: string;
    noRole: string;
    removeSuccess: string;
    addSuccess: string;
}

export interface Currency2 {
    addshopitem: Addshopitem;
    removeshopitem: Removeshopitem;
    bal: Bal;
    beg: Beg;
    buy: Buy;
    rewards: Rewards;
    deposit: Deposit;
    find: Find;
    inv: Inv;
    lb: Lb;
    sell: Sell;
    transfer: Transfer;
    work: Beg;
}

export interface En {
    name: string;
    native: string;
    locale: string;
    commands: Commands;
    utils: Utils;
}

export interface Utils {
    inCooldown: string;
    noPerms: string;
    botNoPerms: string;
    errorCmd: string;
    error: string;
    ghostPing: string;
    sender: string;
    pingedUser: string;
    message: string;
    ghostPingEmbedFooter: string;
    page: string;
    true: string;
    false: string;
    footers: string[];
}

export interface Commands {
    currency: Currency;
    fun: Fun;
    info: Info;
    moderation: Moderation;
    music: Music;
}

export interface Music {
    noMusicPlaying: string;
    noMusicBefore: string;
    noFilter: string;
    noIndex: string;
    noNegativeIndex: string;
    backSuccess: string;
    clearSuccess: string;
    filterSuccess: string;
    skipSuccess: string;
    loopType: string[];
    nowplayingMethods: string[];
    nowplayingDesc: string;
    saveButtonLabel: string;
    pauseSuccess: string;
    areYouSurePlayNotYT: string;
    cancel: string;
    timeout: string;
    noResults: string;
    cantJoin: string;
    playSuccess: string;
    liveStream: string;
    serverQueue: string;
    noTracks: string;
    queueSettings: string;
    nowplaying: string;
    noMoreTracks: string;
    removeSuccess: string;
    resumeSuccess: string;
    saveMsg: string;
    saveSuccess: string;
    searchEmbedTitle: string;
    chooseTrack: string;
    invalidTrack: string;
    shuffleSuccess: string;
    stopSuccess: string;
    noVol: string;
    volEqualCurrent: string;
    volNotInRange: string;
    volSuccess: string;
    seekSuccess: string;
    saveTrack: string;
    duration: string;
    url: string;
    saveServer: string;
    requestedBy: string;
    cantDM: string;
    onlyYT: string;
    noPlaylist: string;
    addSuccess: string;
    removePlaylistTrackSuccess: string;
    haveSamePlaylist: string;
    createPlaylistSuccess: string;
    deletePlaylistSuccess: string;
    noPlaylists: string;
    yourPlaylists: string;
    tracks: string;
    emptyPlaylist: string;
    playlistSettings: string;
    noMoreTracksPlaylist: string;
    noUser: string;
    otherHasPlaylist: string;
    otherDoesntHavePlaylist: string;
    shareSuccess: string;
    unshareSuccess: string;
    playlist: string;
    track: string;
    queue: string;
    none: string;
    autoplay: string;
}

export interface Moderation {
    asciify: Asciify;
    modActions: ModActions;
    createGiveaway: CreateGiveaway;
    settings: Settings;
    reactroles: Reactroles;
    createticket: Createticket;
}

export interface Createticket {
    noName: string;
    noDesc: string;
    categoryNotCategory: string;
    channelNotChannel: string;
    success: string;
    areYouSureClose: string;
    closedBy: string;
    closeSuccess: string;
    deleteSuccess: string;
    noTicket: string;
    noCategory: string;
    ticketMsg: string;
    ticketTitle: string;
    ticketDesc: string;
    openSuccess: string;
    openedBy: string;
    transcript: string;
    transcriptDocxDesc: string;
    transcriptFor: string;
    channelId: string;
    oldestMsg: string;
    clickToJump: string;
    noMsg: string;
    cantLoad: string;
    fileTooBig: string;
}

export interface Reactroles {
    noReactRole: string;
    noPerms: string;
    invalidEmoji: string;
    roleTooHigh: string;
    success: string;
    noRole: string;
    removeSuccess: string;
    addSuccess: string;
}

export interface Settings {
    badWords: string;
    badWordsSpoilers: string;
    welcome: string;
    welcomeChannel: string;
    welcomeMessage: string;
    welcomeRole: string;
    tags: string;
    tagDescriptions: string;
    misc: string;
    suggestionChannel: string;
    ghostPing: string;
    badWordPresetNames: BadWordPresetNames;
    customBadWords: string;
    badWordsTextInputPlaceHolder: string;
    updated: string;
    welcomeSettings: string;
    welcomeMessageTextInputPlaceHolder: string;
    welcomeChannelTextInputPlaceHolder: string;
    welcomeRoleTextInputPlaceHolder: string;
    invalidChannel: string;
    invalidRole: string;
    miscSettings: string;
    suggestionChannelTextInputPlaceHolder: string;
    ghostPingTextInputPlaceHolder: string;
    yes: string[];
    settings: string;
    addTag: string;
    removeTag: string;
    tag: string;
    customid: string;
    value: string;
    tagTextInputPlaceHolder: string;
    customIdTextInputPlaceHolder: string;
    valueTextInputPlaceHolder: string;
}

export interface BadWordPresetNames {
    low: string;
    medium: string;
    high: string;
    highest: string;
    superHigh: string;
    custom: string;
}

export interface CreateGiveaway {
    success: string;
}

export interface ModActions {
    bulkDelete: BulkDelete;
}

export interface BulkDelete {
    invalidAmount: string;
    messagesDeleted: string;
}

export interface Asciify {
    userNotInGuild: string;
    userAlreadyAsciified: string;
    blank: string;
    success: string;
}

export interface Info {
    help: Help;
    links: Links;
    ping: Ping;
    poll: Poll;
    userInfo: UserInfo;
    serverInfo: ServerInfo;
    suggest: Suggest;
    birthday: BirthdayLocaleType;
    tag: Tag;
    language: Language;
    dictionary: Dictionary;
}

export interface Dictionary {
    noWord: string;
    offensive: string;
    stems: string;
    topDefs: string;
    examples: string;
}

export interface Language {
    noLanguage: string;
    success: string;
}

export interface Tag {
    noTag: string;
    tagNotFound: string;
    pingUser: string;
}

export interface BirthdayLocaleType {
    invalidBdate: string;
    noBday: string;
    noBdate: string;
    setSuccess: string;
    updateSuccess: string;
    noBdays: string;
    listEmbedTitle: string;
    nextBday: string;
    channelNotText: string;
    setupSuccess: string;
    removeSuccess: string;
}

export interface Suggest {
    embedTitle: string;
    noChannel: string;
    noSuggestion: string;
    noGuildSettings: string;
    success: string;
}

export interface ServerInfo {
    filterLevels: FilterLevels;
    verificationLevels: VerificationLevels;
    embedTitle: string;
    general: string;
    name: string;
    ID: string;
    boostTier: string;
    tier: string;
    noTier: string;
    explicitFilter: string;
    verificationLevel: string;
    statistics: string;
    roleCount: string;
    emojiCount: string;
    regEmojiCount: string;
    animEmojiCount: string;
    memberCount: string;
    botCount: string;
    textChannelCount: string;
    voiceChannelCount: string;
    boostCount: string;
    presense: string;
    online: string;
    idle: string;
    dnd: string;
    offline: string;
    roles: string;
}

export interface VerificationLevels {
    NONE: string;
    LOW: string;
    MEDIUM: string;
    HIGH: string;
    VERY_HIGH: string;
}

export interface FilterLevels {
    DISABLED: string;
    MEMBER_WITHOUT_ROLES: string;
    ALL_MEMBERS: string;
}

export interface UserInfo {
    'bot?': string;
    createAt: string;
    discrim: string;
    clientID: string;
    clientTag: string;
    uname: string;
    title: string;
}

export interface Poll {
    invalidDuration: string;
    embedDesc: string;
    newPoll: string;
}

export interface Ping {
    embedTitle: string;
    embedDesc: string;
    fieldMsg: FieldMsg;
}

export interface FieldMsg {
    '<0': string;
    '<1': string;
    '<5': string;
    '<10': string;
    '<15': string;
    '<50': string;
    '<100': string;
    '<500': string;
    '<1000': string;
    '<2500': string;
    '<5000': string;
    '<10000': string;
    else: string;
    title: string;
}

export interface Links {
    embedTitle: string;
    github: string;
    discServer: string;
    invite: string;
    trello: string;
    topgg: string;
    discBots: string;
    discBotList: string;
}

export interface Help {
    categories: string[];
    noCategory: string;
    noCommand: string;
    embedTitle: string;
    embedDesc: string;
    commandsInCategory: string;
}

export interface Fun {
    say_embed: Sayembed;
    say: Say;
    slots: Slots;
    tictactoe: Tictactoe;
}

export interface Tictactoe {
    playSelf: string;
    playClient: string;
    playBot: string;
    turn: string;
    notYourTurn: string;
    havePlayedThere: string;
    tie: string;
    gameOver: string;
}

export interface Slots {
    embedTitle: string;
    win: string;
    lose: string;
    noBet: string;
    invalidBet: string;
    noMoneyBet: string;
}

export interface Say {
    noText: string;
    textTooLong: string;
    noPerms: string;
}

export interface Sayembed {
    enterDesc: string;
    specifyTitle: string;
}

export interface Currency {
    addshopitem: Addshopitem;
    removeshopitem: Removeshopitem;
    bal: Bal;
    beg: Beg;
    buy: Buy;
    rewards: Rewards;
    deposit: Deposit;
    find: Find;
    inv: Inv;
    lb: Lb;
    sell: Sell;
    transfer: Transfer;
    work: Beg;
    withdraw: Withdraw;
}

export interface Withdraw {
    noAmount: string;
    negativeMoney: string;
    lowMoney: string;
    bankFull: string;
    allSuccess: string;
    success: string;
}

export interface Transfer {
    invalidUser: string;
    sendToSelf: string;
    invalidAmount: string;
    lowAmount: string;
    success: string;
}

export interface Sell {
    invalidItem: string;
    unknownItem: string;
    success: string;
}

export interface Lb {
    title: string;
    empty: string;
    userDesc: string;
}

export interface Inv {
    title: string;
    noItems: string;
    moreItems: string;
}

export interface Find {
    places: string[];
    cooldown: string;
    success: string;
}

export interface Deposit {
    money: string;
    negativeMoney: string;
    lowMoney: string;
    noMoney: string;
    bankFull: string;
    allSuccess: string;
    success: string;
}

export interface Rewards {
    cooldown: string;
    success: string;
    hourly: string;
    daily: string;
    weekly: string;
    monthly: string;
    yearly: string;
}

export interface Buy {
    storeTitle: string;
    storeItem: string;
    noItem: string;
    noMoney: string;
    success: string;
}

export interface Beg {
    users: string[];
    cooldown: string;
    success: string;
}

export interface Bal {
    title: string;
    wallet: string;
    bank: string;
    total: string;
}

export interface Removeshopitem {
    noItem: string;
    success: string;
}

export interface Addshopitem {
    noPrice: string;
    noItemName: string;
    invalidPrice: string;
    noInvPrice: string;
    noInv: string;
    success: string;
}