import { tags, footers, admins } from './../config.json'
import Discord, { DiscordAPIError } from 'discord.js'
import fs from 'fs'
import updateGrid from '../Util/tictactoe'
import officegen from 'officegen'
const msglimit = 100
type AutocompleteThingy = {
    name: string,
    value: string,
}

module.exports = {
    name: 'interactionCreate',
    async execute(interaction: Discord.Interaction, client: any) {
        if (interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.slashCommands.get(interaction.commandName);

            if (!command) return;

            if (command.permissions) {
                if ((command.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(command.permissions)) return interaction.reply({ content: "You don't have permission to use this command!", ephemeral: true });
            }

            try {
                client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${interaction.user.username} did the ${interaction.isCommand() ? "slash command" : "context menu command"} ${command.data.name} ${interaction.isCommand() && interaction.options.data.length != 0 ? `with the options${interaction.options.data.map(option => ` \`${option.name}: ${option.value}`)}\`` : ""}`); // log the command
                await command.execute(interaction, client, footers);
            } catch (error: DiscordAPIError | any | Error) {
                console.error(error);
                await client.users.cache.get('709950767670493275').send({ content: `Error in command ${command.data.name}\n${error}\nError Code: ${error.code}\nHTTP status: ${error.httpStatus}\nPath: ${error.path}\nRequest Data: ${error.requestData?.json}` }); // log the error to the bot owner
                await client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send({ content: `Error in command ${command.data.name}\n${error}\nError Code: ${error.code}\nHTTP status: ${error.httpStatus}\nPath: ${error.path}\nRequest Data: ${error.requestData?.json}` }); // log the error to the bot logs channel
                try {
                    await interaction.reply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue", ephemeral: true });
                }
                catch (err) {
                    await interaction.editReply({ content: 'There was an error while executing this command!\n' + error + "\n\nSuccessfully DMed the owner about the error, very sorry about this issue" });
                }
            }
        }
        else if (interaction.isButton()) {
            client.guilds.cache.get("962861680226865193").channels.cache.get("979662019202527272").send(`${interaction.user.username} clicked on a button with the custom id of ${interaction.customId} on the message with the content ${interaction.message.content}`); // log the command

            const button = client.buttons.get(interaction.customId);

            if (button) {
                if (button?.permissions) {
                    if ((button.permissions == "BotAdmin" && !admins.includes(interaction.user.id)) || !interaction.memberPermissions?.has(button.permissions)) return interaction.reply("You don't have permission to use this command!");
                }

                try {
                    button?.execute(interaction, client, footers);
                } catch (error) {
                    console.error(error);
                    try {
                        await interaction.reply({ content: 'There was an error while executing this command!\n' + error, ephemeral: true });
                    }
                    catch (err) {
                        await interaction.editReply({ content: 'There was an error while executing this command!\n' + error });
                    }
                }
                return
            }

            const queue = client.player.getQueue(interaction.guildId);
            if (interaction.customId.startsWith("ttt")) {
                await updateGrid(interaction, client)
            }
            if (interaction.customId.startsWith("ticket-")) {
                const ticket = interaction.customId.split("-")[1];
                const ticketInfo = await client.tickets.findOne({ title: ticket });
                if (!ticketInfo) return interaction.reply("Ticket not found!");
                const embed = new Discord.MessageEmbed()
                    .setTitle(`New ${ticketInfo.title} ticket!`)
                    .setDescription(`Support will be with you shortly.\nTo close this ticket react with 🔒\n**DO NOT PING ANYONE**`)
                    .setColor('RANDOM')
                const guild = client.guilds.cache.get(ticketInfo.guildId);
                const category = guild.channels.cache.get(ticketInfo.categoryId);
                const channel = await category.createChannel(`${ticketInfo.title}-ticket-${ticketInfo.id}`, {
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
                })
                const row = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setEmoji("🔒")
                            .setStyle('SECONDARY')
                            .setCustomId(`close-ticket-notsure-${ticketInfo.title}`)
                    );
                await ticketInfo.updateOne({ $set: { channelId: channel.id } });
                await channel.send({ embeds: [embed], content: `${interaction.user} ${ticketInfo.title} ticket opened!`, components: [row] })
                return interaction.reply({ content: "Ticket opened!", ephemeral: true });
            }
            else if (interaction.customId.startsWith("close-ticket-notsure-")) {
                const areYouSure = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setLabel("Close")
                            .setStyle('DANGER')
                            .setCustomId(`close-ticket-${interaction.customId.split("-")[3]}`)
                    )
                interaction.reply({ content: "Are you sure you want to close this ticket?", components: [areYouSure], ephemeral: true });
            }
            else if (interaction.customId.startsWith("close-ticket-")) {
                const ticket = interaction.customId.split("-")[2];
                const ticketInfo = await client.tickets.findOne({ title: ticket });
                if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("You can't close tickets in DM channels!");


                const controls = new Discord.MessageActionRow()
                    .addComponents(
                        new Discord.MessageButton()
                            .setEmoji("📑")
                            .setStyle('SECONDARY')
                            .setCustomId(`transcribe-ticket-${interaction.customId.split("-")[2]}`),
                        new Discord.MessageButton()
                            .setEmoji("🔓")
                            .setStyle('SECONDARY')
                            .setCustomId(`open-ticket-${interaction.customId.split("-")[2]}`),
                        new Discord.MessageButton()
                            .setEmoji("⛔")
                            .setStyle('DANGER')
                            .setCustomId(`delete-ticket-${interaction.customId.split("-")[2]}`)
                    )
                if (!interaction.member || !(interaction.member instanceof Discord.GuildMember)) return interaction.reply("You can't close tickets in DM channels!");

                interaction.channel.send({ content: `Ticket closed by ${interaction.user}`, components: [controls] });
                ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
                const closecategory = client.guilds.cache.get(ticketInfo.guildId).channels.cache.get(ticketInfo.closeCategoryId);
                interaction.channel.setParent(closecategory);
                await interaction.channel.edit({ name: `closed-${ticketInfo.title}-ticket-${ticketInfo.id}` });
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
                if (!interaction.memberPermissions?.has("MANAGE_MESSAGES")) return interaction.reply("You don't have permission to use this command!");
                const ticket = interaction.customId.split("-")[3]
                if (!(interaction.message instanceof Discord.Message)) return
                await interaction.message.delete();
                await client.tickets.deleteOne({ title: ticket });
                interaction.reply({ content: "Deleted ticket successfully", ephemeral: true });
                return;
            }
            else if (interaction.customId.startsWith("delete-ticket-")) {
                const ticket = interaction.customId.split("-")[2];
                const ticketInfo = await client.tickets.findOne({ title: ticket });
                if (!ticketInfo) return interaction.reply("Ticket not found!");
                if (!(interaction.message instanceof Discord.Message)) return
                ticketInfo.updateOne({ $pull: { channelId: interaction.channel?.id } });
                interaction.reply("Deleted Ticket Successfully");
                await interaction.message.delete();
                await interaction.channel?.delete();
                return;
            }
            else if (interaction.customId.startsWith("transcribe-ticket-")) {
                const ticket = interaction.customId.split("-")[2];
                const ticketInfo = await client.tickets.findOne({ title: ticket });
                if (!ticketInfo) return interaction.reply("Ticket not found!");
                if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("You can't transcribe tickets in DM channels!");
                interaction.deferReply();
                let docx = officegen({
                    type: 'docx',
                    author: client.user.username,
                    creator: client.user.username,
                    description: `Transcript for the Channel #${interaction.channel.name} with the ID: ${interaction.channel.id}`,
                    pageMargins: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
                    title: `Transcript!`
                });
                docx.on('error', function (err: any) {
                    return console.log(err)
                });
                const path = `./assets/transcripts/${interaction.channel.name}-${interaction.channel.id}.docx`;
                const filename = `${interaction.channel.name}-${interaction.channel.id}.docx`;
                let pObj = docx.createP(); //Make a new paragraph
                pObj.options.align = 'left';  //align it to the left page
                pObj.options.indentLeft = -350;   //overdrive it 350px to the left
                pObj.options.indentFirstLine = -250;  //go 250 px to the - left so right of the overdrive
                pObj.addText('Transcript for:    #' + interaction.channel.name, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 22 }); //add the TEXT CHANNEL NAME
                pObj.addLineBreak(); //make a new LINE
                pObj.addText("ChannelID: " + interaction.channel.id, { font_face: 'Arial', color: '000000', bold: false, font_size: 10 }); //Channel id
                pObj.addLineBreak(); //Make a new LINE
                pObj.addText(`Oldest message at the BOTTOM `, { hyperlink: 'myBookmark', font_face: 'Arial', color: '5dbcd2', italic: true, font_size: 8 });  //Make a hyperlink to the BOOKMARK (Created later)
                pObj.addText(`  [CLICK HERE TO JUMP]`, { hyperlink: 'myBookmark', font_face: 'Arial', color: '1979a9', italic: false, bold: true, font_size: 8 });  //Make a hyperlink to the BOOKMARK (Created later)
                pObj.addLineBreak();
                let messageCollection: any = new Discord.Collection<string, Discord.Message>(); //make a new collection
                let channelMessages = await interaction.channel.messages.fetch({//fetch the last 100 messages
                    limit: 100
                }).catch(err => console.log(err)); //catch any error
                if (!channelMessages) return interaction.reply("No messages found!");
                messageCollection = messageCollection.concat(channelMessages); //add them to the Collection
                let tomanymsgs = 1; //some calculation for the messagelimit
                let messagelimit = Number(msglimit) / 100; //devide it by 100 to get a counter
                if (messagelimit < 1) messagelimit = 1; //set the counter to 1 if its under 1
                while (channelMessages?.size === 100) { //make a loop if there are more then 100 messages in this channel to fetch
                    if (tomanymsgs === messagelimit) break; //if the counter equals to the limit stop the loop
                    tomanymsgs += 1; //add 1 to the counter
                    let lastMessageId: any = channelMessages.lastKey(); //get key of the already fetched messages above
                    channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err)); //Fetch again, 100 messages above the already fetched messages
                    if (channelMessages) //if its true
                        messageCollection = messageCollection.concat(channelMessages); //add them to the collection
                }
                let msgs = messageCollection.reverse(); //reverse the array to have it listed like the discord chat
                //now for every interaction in the array make a new paragraph!
                await msgs.forEach(async (msg: Discord.Message) => {
                    // Create a new paragraph:
                    pObj = docx.createP()
                    pObj.options.align = 'left'; //Also 'right' or 'justify'.
                    //Username and Date
                    pObj.addText(`${msg.author.tag}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 });
                    pObj.addText(`   ${msg.createdAt.toDateString()}   ${msg.createdAt.toLocaleTimeString()}`, { font_face: 'Arial', color: '3c5c63', bold: true, font_size: 14 }); //
                    //LINEBREAK
                    pObj.addLineBreak()
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
                    pObj.addLineBreak()
                    pObj.addText(`______________________________________________________________________________________________________________________________________________________________________________________________________________`, { color: 'a6a6a6', font_size: 4 });

                });
                pObj.startBookmark('myBookmark');  //add a bookmark at tha last interaction to make the jump
                pObj.endBookmark();
                let out = fs.createWriteStream(path)  //write everything in the docx file
                out.on('error', function (err) {
                    console.log(err)
                })
                out.on("finish", function () {
                    try { // try to send the file
                        const buffer = fs.readFileSync(path); //get a buffer file
                        const attachment = new Discord.MessageAttachment(buffer, filename); //send it as an attachment
                        //send the Transcript Into the Channel and then Deleting it again from the FOLDER
                        interaction.editReply({ files: [attachment] }).then(del => { //after sending it delete the file and edit the temp interaction to an approvement
                            fs.unlinkSync(path)
                        });
                    } catch (err) { // if the file is to big to be sent, then catch it!
                        console.log(err)
                        interaction.editReply('File too big!')
                        fs.unlinkSync(path) //delete the docx
                    }
                })
                docx.generate(out)
                return;
            }
            else if (interaction.customId.startsWith("open-ticket-")) {
                const ticket = interaction.customId.split("-")[2];
                const ticketInfo = await client.tickets.findOne({ title: ticket });
                if (!interaction.member || !interaction.guild) return interaction.reply("you are not in a guild! (no idea how this happened)");
                if (!ticketInfo) return interaction.reply("Ticket not found!");
                if (interaction.channel?.type !== "GUILD_TEXT") return interaction.reply("This command can only be used in a server!");
                const category = client.guilds.cache.get(interaction.guildId).channels.cache.get(ticketInfo.categoryId);
                interaction.channel.setParent(category);
                await interaction.channel.edit({ name: `${ticketInfo.title}-ticket-${ticketInfo.id}` });
                interaction.channel.permissionOverwrites.set(
                    [
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
                        }])
                interaction.reply({ content: "Opened Ticket Successfully", ephemeral: true });
                interaction.channel.send({ content: `Ticket opened by ${interaction.user}` });
                return;
            }
            else if (interaction.customId.startsWith("form-")) {
                const name = interaction.customId.split("-")[1];
                const form = await client.forms.findOne({ title: name });
                if (!form) return interaction.reply("Form not found!");
                const modal = new Discord.Modal()
                    .setTitle(form.name)
                    .setCustomId(form.customId)
                const fields = [];
                for (const field of form.fields) {
                    let component = new Discord.TextInputComponent()
                        .setLabel(field.name)
                        .setCustomId(field.customId)
                        .setStyle(field.style);
                    const actionRow = new Discord.MessageActionRow<Discord.TextInputComponent>().addComponents(component);

                    fields.push(actionRow);
                }
                modal.addComponents(...fields);
                return await interaction.showModal(modal);
            }
            return
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
                    const guildTags = client.cachedTags.get(interaction.guildId)?.filter((tag: AutocompleteThingy) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? ""))
                    const globalTags = tags.filter((tag: AutocompleteThingy) => tag.name.toLowerCase().includes(interaction.options.getString("tag") ?? ""));
                    const respondTags = [...globalTags];
                    if (guildTags) {
                        respondTags.push(...guildTags);
                    }
                    await interaction.respond(respondTags);
                    break;
                case 'sell':
                    const inventory = client.cachedInventories.get(interaction.user.id)?.filter((item: AutocompleteThingy) => item.name.toLowerCase().includes(interaction.options.getString("item") ?? ""))
                    console.log(inventory)
                    await interaction.respond(inventory);
                    break;
                case 'buy':
                    const guildItems = client.cachedShopItems.get(interaction.guildId)?.filter((buy: AutocompleteThingy) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""))
                    const globalItems = client.globalShopItems.filter((buy: AutocompleteThingy) => buy.name.toLowerCase().includes(interaction.options.getString("item") ?? ""));
                    const respondItems = [...globalItems];
                    if (guildItems) {
                        respondItems.push(...guildItems);
                    }
                    await interaction.respond(respondItems);
                    break;
            }
        }
    }
}