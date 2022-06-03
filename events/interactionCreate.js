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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_json_1 = require("./../config.json");
const discord_js_1 = __importDefault(require("discord.js"));
const fs_1 = __importDefault(require("fs"));
const tictactoe_1 = __importDefault(require("../Util/tictactoe"));
const officegen_1 = __importDefault(require("officegen"));
const msglimit = 100;
module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function* () {
            if (interaction.isCommand() || interaction.isContextMenu()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (!command)
                    return;
                if (command.permissions) {
                    if ((command.permissions == "BotAdmin" && !config_json_1.admins.includes(interaction.user.id)) || !((_a = interaction.memberPermissions) === null || _a === void 0 ? void 0 : _a.has(command.permissions)))
                        return interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true });
                }
                try {
                    client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${interaction.user.username} did the ${interaction.isCommand() ? "slash command" : "context menu command"} ${command.data.name} ${interaction.isCommand() && interaction.options.data.length != 0 ? `with the options${interaction.options.data.map(option => ` \`${option.name}: ${option.value}`)}\`` : ""}`); // log the command
                    yield command.execute(interaction, client, config_json_1.footers);
                }
                catch (error) {
                    console.error(error);
                    yield client.users.cache.get('709950767670493275').send({ content: `Error in command ${command.data.name}\n${error}\nError Code: ${error.code}\nHTTP status: ${error.httpStatus}\nPath: ${error.path}\nRequest Data: ${(_b = error.requestData) === null || _b === void 0 ? void 0 : _b.json}` }); // log the error to the bot owner
                    yield client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `Error in command ${command.data.name}\n${error}\nError Code: ${error.code}\nHTTP status: ${error.httpStatus}\nPath: ${error.path}\nRequest Data: ${(_c = error.requestData) === null || _c === void 0 ? void 0 : _c.json}` }); // log the error to the bot logs channel
                    try {
                        yield interaction.reply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue", ephemeral: true });
                    }
                    catch (err) {
                        yield interaction.editReply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue" });
                    }
                }
            }
            else if (interaction.isButton()) {
                client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${interaction.user.username} clicked on a button with the custom id of ${interaction.customId} on the message with the content ${interaction.message.content}`); // log the command
                const button = client.buttons.get(interaction.customId);
                if (button) {
                    if (button === null || button === void 0 ? void 0 : button.permissions) {
                        if ((button.permissions == "BotAdmin" && !config_json_1.admins.includes(interaction.user.id)) || !((_d = interaction.memberPermissions) === null || _d === void 0 ? void 0 : _d.has(button.permissions)))
                            return interaction.reply("You don't have permission to use this command!");
                    }
                    try {
                        button === null || button === void 0 ? void 0 : button.execute(interaction, client, config_json_1.footers);
                    }
                    catch (error) {
                        console.error(error);
                        try {
                            yield interaction.reply({ content: 'There was an error while executing this command!\n' + error, ephemeral: true });
                        }
                        catch (err) {
                            yield interaction.editReply({ content: 'There was an error while executing this command!\n' + error });
                        }
                    }
                    return;
                }
                const queue = client.player.getQueue(interaction.guildId);
                if (interaction.customId.startsWith("ttt")) {
                    yield (0, tictactoe_1.default)(interaction, client);
                }
                if (interaction.customId.startsWith("ticket-")) {
                    const ticket = interaction.customId.split("-")[1];
                    const ticketInfo = yield client.tickets.findOne({ title: ticket });
                    if (!ticketInfo)
                        return interaction.reply("Ticket not found!");
                    const embed = new discord_js_1.default.MessageEmbed()
                        .setTitle(`New ${ticketInfo.title} ticket!`)
                        .setDescription(`Support will be with you shortly.\nTo close this ticket react with 🔒\n**DO NOT PING ANYONE**`)
                        .setColor('RANDOM');
                    const guild = client.guilds.cache.get(ticketInfo.guildId);
                    const category = guild.channels.cache.get(ticketInfo.categoryId);
                    const channel = yield category.createChannel(`${ticketInfo.title}-ticket-${ticketInfo.id}`, {
                        permissionOverwrites: [
                            {
                                id: interaction.member,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            },
                            {
                                id: guild.id,
                                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            },
                            {
                                id: client.user.id,
                                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                            }
                        ]
                    });
                    const row = new discord_js_1.default.MessageActionRow()
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setEmoji("🔒")
                        .setStyle('SECONDARY')
                        .setCustomId(`close-ticket-notsure-${ticketInfo.title}`));
                    yield ticketInfo.updateOne({ $set: { channelId: channel.id } });
                    yield channel.send({ embeds: [embed], content: `${interaction.user} ${ticketInfo.title} ticket opened!`, components: [row] });
                    return interaction.reply({ content: "Ticket opened!", ephemeral: true });
                }
                else if (interaction.customId.startsWith("close-ticket-notsure-")) {
                    const areYouSure = new discord_js_1.default.MessageActionRow()
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setLabel("Close")
                        .setStyle('DANGER')
                        .setCustomId(`close-ticket-${interaction.customId.split("-")[3]}`));
                    interaction.reply({ content: "Are you sure you want to close this ticket?", components: [areYouSure], ephemeral: true });
                }
                else if (interaction.customId.startsWith("close-ticket-")) {
                    const ticket = interaction.customId.split("-")[2];
                    const ticketInfo = yield client.tickets.findOne({ title: ticket });
                    if (((_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.type) !== "GUILD_TEXT")
                        return interaction.reply("You can't close tickets in DM channels!");
                    const controls = new discord_js_1.default.MessageActionRow()
                        .addComponents(new discord_js_1.default.MessageButton()
                        .setEmoji("📑")
                        .setStyle('SECONDARY')
                        .setCustomId(`transcribe-ticket-${interaction.customId.split("-")[2]}`), new discord_js_1.default.MessageButton()
                        .setEmoji("🔓")
                        .setStyle('SECONDARY')
                        .setCustomId(`open-ticket-${interaction.customId.split("-")[2]}`), new discord_js_1.default.MessageButton()
                        .setEmoji("⛔")
                        .setStyle('DANGER')
                        .setCustomId(`delete-ticket-${interaction.customId.split("-")[2]}`));
                    if (!interaction.member || !(interaction.member instanceof discord_js_1.default.GuildMember))
                        return interaction.reply("You can't close tickets in DM channels!");
                    interaction.channel.send({ content: `Ticket closed by ${interaction.user}`, components: [controls] });
                    ticketInfo.updateOne({ $pull: { channelId: (_f = interaction.channel) === null || _f === void 0 ? void 0 : _f.id } });
                    const closecategory = client.guilds.cache.get(ticketInfo.guildId).channels.cache.get(ticketInfo.closeCategoryId);
                    interaction.channel.setParent(closecategory);
                    yield interaction.channel.edit({ name: `closed-${ticketInfo.title}-ticket-${ticketInfo.id}` });
                    interaction.channel.permissionOverwrites.create(interaction.member.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ADD_REACTIONS: true
                    });
                    interaction.reply({ content: "Closed Ticket Successfully", ephemeral: true });
                    return;
                }
                else if (interaction.customId.startsWith("delete-ticket-type-")) {
                    if (!((_g = interaction.memberPermissions) === null || _g === void 0 ? void 0 : _g.has("MANAGE_MESSAGES")))
                        return interaction.reply("You don't have permission to use this command!");
                    const ticket = interaction.customId.split("-")[3];
                    if (!(interaction.message instanceof discord_js_1.default.Message))
                        return;
                    yield interaction.message.delete();
                    yield client.tickets.deleteOne({ title: ticket });
                    interaction.reply({ content: "Deleted ticket successfully", ephemeral: true });
                    return;
                }
                else if (interaction.customId.startsWith("delete-ticket-")) {
                    const ticket = interaction.customId.split("-")[2];
                    const ticketInfo = yield client.tickets.findOne({ title: ticket });
                    if (!ticketInfo)
                        return interaction.reply("Ticket not found!");
                    if (!(interaction.message instanceof discord_js_1.default.Message))
                        return;
                    ticketInfo.updateOne({ $pull: { channelId: (_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.id } });
                    interaction.reply("Deleted Ticket Successfully");
                    yield interaction.message.delete();
                    yield ((_j = interaction.channel) === null || _j === void 0 ? void 0 : _j.delete());
                    return;
                }
                else if (interaction.customId.startsWith("transcribe-ticket-")) {
                    const ticket = interaction.customId.split("-")[2];
                    const ticketInfo = yield client.tickets.findOne({ title: ticket });
                    if (!ticketInfo)
                        return interaction.reply("Ticket not found!");
                    if (((_k = interaction.channel) === null || _k === void 0 ? void 0 : _k.type) !== "GUILD_TEXT")
                        return interaction.reply("You can't transcribe tickets in DM channels!");
                    interaction.deferReply();
                    let docx = (0, officegen_1.default)({
                        type: 'docx',
                        author: client.user.username,
                        creator: client.user.username,
                        description: `Transcript for the Channel #${interaction.channel.name} with the ID: ${interaction.channel.id}`,
                        pageMargins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
                        title: `Transcript!`
                    });
                    docx.on('error', function (err) {
                        return console.log(err);
                    });
                    const path = `./assets/transcripts/${interaction.channel.name}-${interaction.channel.id}.docx`;
                    const filename = `${interaction.channel.name}-${interaction.channel.id}.docx`;
                    let pObj = docx.createP(); //Make a new paragraph
                    pObj.options.align = 'left'; //align it to the left page
                    pObj.options.indentLeft = -350; //overdrive it 350px to the left
                    pObj.options.indentFirstLine = -250; //go 250 px to the - left so right of the overdrive
                    pObj.addText('Transcript for:    #' + interaction.channel.name, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 22 }); //add the TEXT CHANNEL NAME
                    pObj.addLineBreak(); //make a new LINE
                    pObj.addText("ChannelID: " + interaction.channel.id, { font_face: 'Arial', color: '000000', bold: false, font_size: 10 }); //Channel id
                    pObj.addLineBreak(); //Make a new LINE
                    pObj.addText(`Oldest message at the BOTTOM `, { hyperlink: 'myBookmark', font_face: 'Arial', color: '5dbcd2', italic: true, font_size: 8 }); //Make a hyperlink to the BOOKMARK (Created later)
                    pObj.addText(`  [CLICK HERE TO JUMP]`, { hyperlink: 'myBookmark', font_face: 'Arial', color: '1979a9', italic: false, bold: true, font_size: 8 }); //Make a hyperlink to the BOOKMARK (Created later)
                    pObj.addLineBreak();
                    let messageCollection = new discord_js_1.default.Collection(); //make a new collection
                    let channelMessages = yield interaction.channel.messages.fetch({
                        limit: 100
                    }).catch(err => console.log(err)); //catch any error
                    if (!channelMessages)
                        return interaction.reply("No messages found!");
                    messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
                    let tomanymsgs = 1; //some calculation for the messagelimit
                    let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
                    if (messagelimit < 1)
                        messagelimit = 1; //set the counter to 1 if its under 1
                    while ((channelMessages === null || channelMessages === void 0 ? void 0 : channelMessages.size) === 100) { //make a loop if there are more then 100 messages in this channel to fetch
                        if (tomanymsgs === messagelimit)
                            break; //if the counter equals to the limit stop the loop
                        tomanymsgs += 1; //add 1 to the counter
                        let lastMessageId = channelMessages.lastKey(); //get key of the already fetched messages above
                        channelMessages = yield interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err)); //Fetch again, 100 messages above the already fetched messages
                        if (channelMessages) //if its true
                            messageCollection = messageCollection.concat(channelMessages); //add them to the collection
                    }
                    let msgs = messageCollection.reverse(); //reverse the array to have it listed like the discord chat
                    //now for every interaction in the array make a new paragraph!
                    yield msgs.forEach((msg) => __awaiter(this, void 0, void 0, function* () {
                        // Create a new paragraph:
                        pObj = docx.createP();
                        pObj.options.align = 'left'; //Also 'right' or 'justify'.
                        //Username and Date
                        pObj.addText(`${msg.author.tag}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 });
                        pObj.addText(`   ${msg.createdAt.toDateString()}   ${msg.createdAt.toLocaleTimeString()}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 }); //
                        //LINEBREAK
                        pObj.addLineBreak();
                        //interaction of user
                        let umsg;
                        if (msg.content.startsWith("```")) {
                            umsg = msg.content.replace(/```/g, "");
                        }
                        else if (msg.attachments.size > 0) {
                            umsg = "Unable to transcript (Embed/Video/Audio/etc.)";
                        }
                        else {
                            umsg = msg.content;
                        }
                        pObj.addText(umsg, { font_face: 'Arial', color: '000000', bold: false, font_size: 10 });
                        //LINEBREAK
                        pObj.addLineBreak();
                        pObj.addText(`______________________________________________________________________________________________________________________________________________________________________________________________________________`, { color: 'a6a6a6', font_size: 4 });
                    }));
                    pObj.startBookmark('myBookmark'); //add a bookmark at tha last interaction to make the jump
                    pObj.endBookmark();
                    let out = fs_1.default.createWriteStream(path); //write everything in the docx file
                    out.on('error', function (err) {
                        console.log(err);
                    });
                    out.on("finish", function () {
                        try { // try to send the file
                            const buffer = fs_1.default.readFileSync(path); //get a buffer file
                            const attachment = new discord_js_1.default.MessageAttachment(buffer, filename); //send it as an attachment
                            //send the Transcript Into the Channel and then Deleting it again from the FOLDER
                            interaction.editReply({ files: [attachment] }).then(del => {
                                fs_1.default.unlinkSync(path);
                            });
                        }
                        catch (err) { // if the file is to big to be sent, then catch it!
                            console.log(err);
                            interaction.editReply('File too big!');
                            fs_1.default.unlinkSync(path); //delete the docx
                        }
                    });
                    docx.generate(out);
                    return;
                }
                else if (interaction.customId.startsWith("open-ticket-")) {
                    const ticket = interaction.customId.split("-")[2];
                    const ticketInfo = yield client.tickets.findOne({ title: ticket });
                    if (!interaction.member || !interaction.guild)
                        return interaction.reply("you are not in a guild! (no idea how this happened)");
                    if (!ticketInfo)
                        return interaction.reply("Ticket not found!");
                    if (((_l = interaction.channel) === null || _l === void 0 ? void 0 : _l.type) !== "GUILD_TEXT")
                        return interaction.reply("This command can only be used in a server!");
                    const category = client.guilds.cache.get(interaction.guildId).channels.cache.get(ticketInfo.categoryId);
                    interaction.channel.setParent(category);
                    yield interaction.channel.edit({ name: `${ticketInfo.title}-ticket-${ticketInfo.id}` });
                    interaction.channel.permissionOverwrites.set([
                        {
                            id: interaction.member,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        },
                        {
                            id: interaction.guild.id,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        },
                        {
                            id: client.user.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        }
                    ]);
                    interaction.reply({ content: "Opened Ticket Successfully", ephemeral: true });
                    interaction.channel.send({ content: `Ticket opened by ${interaction.user}` });
                    return;
                }
                else if (interaction.customId.startsWith("form-")) {
                    const name = interaction.customId.split("-")[1];
                    const form = yield client.forms.findOne({ title: name });
                    if (!form)
                        return interaction.reply("Form not found!");
                    const modal = new discord_js_1.default.Modal()
                        .setTitle(form.name)
                        .setCustomId(form.customId);
                    const fields = [];
                    for (const field of form.fields) {
                        let component = new discord_js_1.default.TextInputComponent()
                            .setLabel(field.name)
                            .setCustomId(field.customId)
                            .setStyle(field.style);
                        const actionRow = new discord_js_1.default.MessageActionRow().addComponents(component);
                        fields.push(actionRow);
                    }
                    modal.addComponents(...fields);
                    return yield interaction.showModal(modal);
                }
                return;
                // switch (interaction.customId) {
                //     case 'saveTrack': {
                //         if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
                //         const embed = new Discord.MessageEmbed()
                //             .setColor('BLUE')
                //             .setTitle(client.user.username + " - Save Track")
                //             .setThumbnail(client.user.displayAvatarURL())
                //             .addField(`Track`, `\`${queue.current.title}\``)
                //             .addField(`Duration`, `\`${queue.current.duration}\``)
                //             .addField(`URL`, `${queue.current.url}`)
                //             .addField(`Saved Server`, `\`${interaction.guild?.name}\``)
                //             .addField(`Requested By`, `${queue.current.requestedBy}`)
                //             .setTimestamp()
                //             .setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                //         interaction.member.send({ embeds: [embed] }).then(() => {
                //             return interaction.reply({ content: `I sent you the name of the music in a private message ✅`, ephemeral: true, components: [] });
                //         }).catch(error => {
                //             return interaction.reply({ content: `I can't send you a private message. ❌`, ephemeral: true, components: [] });
                //         });
                //     }
                //         break
                //     case 'time': {
                //         if (!queue || !queue.playing) return interaction.reply({ content: `No music currently playing. ❌`, ephemeral: true, components: [] });
                //         const progress = queue.createProgressBar();
                //         const timestamp = queue.getPlayerTimestamp();
                //         if (timestamp.progress == 'Infinity') return interaction.message.edit({ content: `This track is live streaming, no duration data to display. 🎧` });
                //         const embed = new Discord.MessageEmbed()
                //             .setColor('BLUE')
                //             .setTitle(queue.current.title)
                //             .setThumbnail(client.user.displayAvatarURL())
                //             .setTimestamp()
                //             .setDescription(`${progress} (**${timestamp.progress}**%)`)
                //             .setFooter({ text: 'Music Code by Umut Bayraktar aka 1umutda', iconURL: interaction.user.displayAvatarURL({ dynamic: true }) });
                //         interaction.message.edit({ embeds: [embed] });
                //         interaction.reply({ content: `**✅ Success:** Time data updated. `, ephemeral: true });
                //     }
                //         break
                // }
            }
            else if (interaction.isAutocomplete()) {
                switch (interaction.commandName) {
                    case 'tag':
                        const guildTags = (_m = client.cachedTags.get(interaction.guildId)) === null || _m === void 0 ? void 0 : _m.filter((tag) => { var _a; return tag.name.toLowerCase().includes((_a = interaction.options.getString("tag")) !== null && _a !== void 0 ? _a : ""); });
                        const globalTags = config_json_1.tags.filter((tag) => { var _a; return tag.name.toLowerCase().includes((_a = interaction.options.getString("tag")) !== null && _a !== void 0 ? _a : ""); });
                        const respondTags = [...globalTags];
                        if (guildTags) {
                            respondTags.push(...guildTags);
                        }
                        yield interaction.respond(respondTags);
                        break;
                    case 'buy':
                    case 'sell':
                        const guildItems = (_o = client.cachedShopItems.get(interaction.guildId)) === null || _o === void 0 ? void 0 : _o.filter((buy) => { var _a; return buy.name.toLowerCase().includes((_a = interaction.options.getString("item")) !== null && _a !== void 0 ? _a : ""); });
                        const globalItems = client.globalShopItems.filter((buy) => { var _a; return buy.name.toLowerCase().includes((_a = interaction.options.getString("item")) !== null && _a !== void 0 ? _a : ""); });
                        const respondItems = [...globalItems];
                        if (guildItems) {
                            respondItems.push(...guildItems);
                        }
                        yield interaction.respond(respondItems);
                        break;
                }
            }
        });
    }
};
